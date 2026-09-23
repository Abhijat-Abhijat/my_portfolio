"use server";

import { headers } from "next/headers";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

// This is the one write path a site visitor can trigger with no auth — it
// only ever inserts one row into contact_submissions (a table with zero RLS
// policies, see supabase/schema.sql). The service-role key stays server-only;
// what's public here is this one constrained action, not the key itself.

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_TIME_MS = 1500;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

async function getClientIp() {
  const h = await headers();
  // x-forwarded-for can be a comma-separated chain; the first entry is the
  // original client (Vercel and most proxies set this).
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  // Timing check: catches scripted submissions faster than a human can type.
  const renderedAt = Number(formData.get("rendered_at") ?? 0);
  if (!renderedAt || Date.now() - renderedAt < MIN_SUBMIT_TIME_MS) {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", error: "Fill in every field." };
  }
  if (name.length > 200 || email.length > 200) {
    return { status: "error", error: "Name or email is too long." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", error: "That email doesn't look right." };
  }
  if (message.length > 5000) {
    return { status: "error", error: "Message is too long (5000 characters max)." };
  }

  const ip = await getClientIp();
  const supabase = getAdminSupabaseClient();

  if (ip !== "unknown") {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);

    if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
      return { status: "error", error: "Too many messages from this connection — try again later." };
    }
  }

  const { error } = await supabase.from("contact_submissions").insert({ name, email, message, ip });

  if (error) {
    console.error("Contact form insert failed:", error.message);
    return { status: "error", error: "Something went wrong — try again in a moment." };
  }

  return { status: "success" };
}
