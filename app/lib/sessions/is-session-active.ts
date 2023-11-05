import { sql } from "../sql";

export const isSessionActive = async (
  sessionId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const session = await sql`SELECT id FROM sessions
    WHERE id = ${sessionId} AND user_id = ${userId}
    LIMIT 1
    `;
    return session[0] && !!session[0].id;
  } catch (error) {
    console.error("Failed to create user session:", error);
    throw new Error("Failed to create user session.");
  }
};
