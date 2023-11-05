import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/app/lib/sql";
import { z } from "zod";
import type { AuthUser, User } from "@/app/lib/definitions";
import { UAParser } from "ua-parser-js";
import removeUndefined from "remove-undefined-objects";
import { verifyPassword } from "./app/lib/hash-password";
import { authConfig } from "./auth.config";
import { deleteSession } from "./app/lib/sessions/delete-session";
import { Provider } from "next-auth/providers";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<
      User[]
    >`SELECT id, email, password from USERS where email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function createUserSession(
  user: User,
  request: Request,
): Promise<string | undefined> {
  try {
    const ua = new UAParser(request.headers.get("user-agent") ?? "");

    const now = new Date();
    const newSession = removeUndefined({
      user_id: user.id,
      created_at: now,
      last_used_at: now,
      browser_name: ua.getBrowser().name,
      browser_version: ua.getBrowser().version,
      os_name: ua.getOS().name,
      os_version: ua.getOS().version,
      device_vendor: ua.getDevice().vendor,
      device_model: ua.getDevice().model,
      device_type: ua.getDevice().type,
      user_ip: request.headers.get("x-forwarded-for"),
    });

    const session = await sql`INSERT INTO sessions ${sql(newSession!)}
    RETURNING id
    `;
    return session[0].id;
  } catch (error) {
    console.error("Failed to create user session:", error);
    throw new Error("Failed to create user session.");
  }
}

export const providers: Provider[] = [
  Credentials({
    async authorize(credentials, request) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);
      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;
        const passwordsMatch = await verifyPassword(user.password, password);

        if (passwordsMatch) {
          // generate new session for logged user
          const sessionId = await createUserSession(user, request);
          return { sessionId, ...user };
        }
      }
      return null;
    },
  }),
];

export const events: NextAuthConfig["events"] = {
  async signOut(message) {
    if ("token" in message) {
      await deleteSession(message.token as unknown as AuthUser);
    }
  },
};

export const nextAuth = NextAuth({
  ...authConfig,
  providers,
  events,
});

export const { handlers, auth, signIn, signOut } = nextAuth;
