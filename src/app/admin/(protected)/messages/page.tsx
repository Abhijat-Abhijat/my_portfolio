import Link from "next/link";
import { deleteMessage, setMessageRead } from "@/lib/admin/message-actions";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default async function MessagesPage() {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const messages = data as Submission[];

  return (
    <div>
      <Link href="/admin" className="text-sm text-fg-muted transition-colors hover:text-fg">
        ← Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-fg">Messages</h1>
      <p className="mt-1 text-sm text-fg-muted">Submissions from the site&rsquo;s contact form.</p>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {messages.length === 0 && (
          <p className="py-6 text-sm text-fg-muted">No messages yet.</p>
        )}
        {messages.map((m) => {
          const boundToggleRead = setMessageRead.bind(null, m.id, !m.is_read);
          const boundDelete = deleteMessage.bind(null, m.id);

          return (
            <div key={m.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <span
                        aria-label="Unread"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                    )}
                    <p className="truncate text-sm font-medium text-fg">{m.name}</p>
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-fg-muted transition-colors hover:text-fg"
                  >
                    {m.email}
                  </a>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg-muted">
                    {m.message}
                  </p>
                  <p className="mt-2 text-xs text-fg-faint">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <form action={boundToggleRead}>
                    <button
                      type="submit"
                      className="text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {m.is_read ? "Mark unread" : "Mark read"}
                    </button>
                  </form>
                  <form action={boundDelete}>
                    <ConfirmSubmitButton
                      confirmMessage={`Delete the message from "${m.name}"? This can't be undone.`}
                      className="text-sm text-fg-muted transition-colors hover:text-danger"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
