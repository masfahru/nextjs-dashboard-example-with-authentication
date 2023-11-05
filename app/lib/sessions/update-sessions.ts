import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import UAParser from "ua-parser-js";
import removeUndefined from "remove-undefined-objects";
import { sql } from "../sql";

export const updateSession = async (
  sessionId: string,
  headers: ReadonlyHeaders,
): Promise<string | undefined> => {
  try {
    const ua = new UAParser(headers.get("user-agent") ?? "");

    const now = new Date();
    const newSession = removeUndefined({
      last_used_at: now,
      browser_name: ua.getBrowser().name,
      browser_version: ua.getBrowser().version,
      os_name: ua.getOS().name,
      os_version: ua.getOS().version,
      device_vendor: ua.getDevice().vendor,
      device_model: ua.getDevice().model,
      device_type: ua.getDevice().type,
      user_ip: headers.get("x-forwarded-for"),
    });

    const session = await sql`UPDATE sessions SET ${sql(newSession!)}
    WHERE id = ${sessionId}
    RETURNING id
    `;
    return session[0].id;
  } catch (error) {
    console.error("Failed to create user session:", error);
    throw new Error("Failed to create user session.");
  }
};
