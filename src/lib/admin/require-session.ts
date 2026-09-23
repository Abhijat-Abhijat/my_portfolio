import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

/**
 * Defense in depth: proxy.ts already gates every /admin/** request, but
 * server actions are also directly callable, so re-check inside each one
 * rather than relying solely on the route being protected.
 */
export async function requireAdminSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    throw new Error("Not authenticated.");
  }
}
