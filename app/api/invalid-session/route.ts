import { cookies } from "next/headers";

export const GET = () => {
  if (cookies().has("next-auth.session-token")) {
    cookies().delete("next-auth.session-token");
  }

  return Response.json({ message: "Invalid session" }, { status: 401 });
};
