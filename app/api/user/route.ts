import { auth } from "@/auth.api";

type ApiResponse = () => Response;

export const GET = auth((req) => {
  return Response.json({ user: req.auth?.user });
}) as ApiResponse;
