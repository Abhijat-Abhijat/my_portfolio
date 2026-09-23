import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Renders admin-authored Markdown to HTML. Content is trusted: the only
 * writer is the authenticated site owner via /admin, not public input, so
 * this intentionally skips a sanitizer pass.
 */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}
