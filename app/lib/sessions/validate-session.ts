import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { isSessionActive } from "./is-session-active";
import { updateSession } from "./update-sessions";
import { Session } from "next-auth";
import { AuthUser } from "../definitions";

export const validateSession = async (
  headers: ReadonlyHeaders,
  session?: Session | null,
) => {
  const { sessionId, id } = session!.user as AuthUser;
  const isSessionValid = await isSessionActive(sessionId, id);
  if (!isSessionValid) return false;
  await updateSession(sessionId, headers);
  return true;
};
