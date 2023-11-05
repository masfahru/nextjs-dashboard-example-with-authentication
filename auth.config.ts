import { NextAuthConfig } from "next-auth";
import { AuthUser } from "./app/lib/definitions";

export const authConfig = {
  logger: {
    warn: () => {},
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const isApiEndpoint =
        request.headers.get("accept") === "application/json";

      if (isApiEndpoint) {
        const isCallbackLogin = request.nextUrl.pathname === "/";
        if (isLoggedIn) {
          if (!isCallbackLogin) return true;
          return Response.redirect(
            new URL("/api/auth/session", request.nextUrl),
          );
        }
        return Response.json({ message: "Not authenticated" }, { status: 401 });
      }
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user && (user as AuthUser).sessionId) {
        token.sessionId = (user as AuthUser).sessionId;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sessionId && session.user) {
        (session.user as AuthUser).id = token.id as string;
        (session.user as AuthUser).sessionId = token.sessionId as string;
      }
      return session;
    },
  },
} as NextAuthConfig;
