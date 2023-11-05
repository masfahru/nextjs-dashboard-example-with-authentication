import NextAuth, { NextAuthConfig } from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { authConfig } from "./auth.config";
import { providers, events } from "./auth";
import { validateSession } from "./app/lib/sessions/validate-session";
import { headers } from "next/headers";

const callbacks: NextAuthConfig["callbacks"] = {
  ...authConfig.callbacks,
  async authorized({ auth, request }) {
    const isLoggedIn = !!auth?.user;

    const isCallbackLogin = request.nextUrl.pathname === "/";
    if (isLoggedIn && auth.user) {
      const isSessionValid = await validateSession(headers(), auth);
      if (isSessionValid) {
        if (!isCallbackLogin) return true;
        return Response.redirect(new URL("/api/auth/session", request.nextUrl));
      } else {
        return Response.redirect(
          new URL("/api/invalid-session", request.nextUrl.origin),
        );
      }
    }
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  },
  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    } else if (new URL(url).origin === baseUrl) {
      if (url === baseUrl) {
        return `${baseUrl}/api/auth/session`;
      }
      return url;
    }
    return `${baseUrl}/api/invalid-session`;
  },
};

export const { auth, handlers } = NextAuth({
  ...authConfig,
  callbacks,
  providers,
  events,
  skipCSRFCheck: skipCSRFCheck, // disable CSRF for api endpoints https://next-auth.js.org/getting-started/rest-api#get-apiauthcsrf
});
