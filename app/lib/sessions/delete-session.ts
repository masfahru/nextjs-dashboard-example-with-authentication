import { AuthUser } from "../definitions";
import { sql } from "../sql";

export const deleteSession = async (user?: AuthUser) => {
  if (!user || !user.id || !user.sessionId) return;
  await sql`DELETE FROM sessions
  WHERE id = ${user.sessionId} AND user_id = ${user.id}`;
};
