export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "lines" // newline-separated -> text[]
  | "pairs" // "Left | Right" per line -> [{a,b}]
  | "boolean"
  | "number"
  | "select"
  | "image";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  pairKeys?: [string, string];
  help?: string;
};

export type ToggleFieldConfig = {
  name: string;
  onLabel: string;
  offLabel: string;
};

export type EntityConfig = {
  key: string;
  label: string;
  table: string;
  titleField: string;
  subtitleField?: string;
  orderBy: string;
  fields: FieldConfig[];
  fixedValues?: Record<string, string>;
  filter?: Record<string, string>;
  imageField?: string;
  toggleField?: ToggleFieldConfig;
};

export const entities: EntityConfig[] = [
  {
    key: "projects",
    label: "Projects",
    table: "projects",
    titleField: "title",
    subtitleField: "category",
    orderBy: "sort_order",
    imageField: "image_url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (URL: /projects/…)", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "stack", label: "Stack (one per line)", type: "lines" },
      {
        name: "visual",
        label: "Placeholder visual (used when no image is uploaded)",
        type: "select",
        options: [
          "agent-graph", "terminal", "product-ui", "dashboard", "kanban",
          "finance", "desktop", "timer", "qr-code", "blog", "game",
        ],
        required: true,
      },
      { name: "image", label: "Screenshot", type: "image" },
      { name: "problem", label: "The Problem", type: "textarea" },
      { name: "approach", label: "The Approach (one step per line)", type: "lines" },
      {
        name: "key_decisions",
        label: "Key Engineering Decisions",
        type: "pairs",
        pairKeys: ["title", "body"],
        help: "One per line: Title | Body",
      },
      {
        name: "metrics",
        label: "Results / metrics",
        type: "pairs",
        pairKeys: ["value", "label"],
        help: "One per line: Value | Label — e.g. 30% | Better matching accuracy",
      },
      { name: "learned", label: "What I Learned", type: "textarea" },
      { name: "link_live", label: "Live demo URL", type: "text" },
      { name: "link_github", label: "GitHub URL", type: "text" },
      { name: "limited_info", label: "Limited info only (shows a note instead of empty sections)", type: "boolean" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    table: "experience_entries",
    titleField: "role",
    subtitleField: "company",
    orderBy: "sort_order",
    fixedValues: { kind: "experience" },
    filter: { kind: "experience" },
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "start_date", label: "Start", type: "text", required: true },
      { name: "end_date", label: "End", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "highlights", label: "Highlights (one per line)", type: "lines" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "volunteer",
    label: "Volunteer & community",
    table: "experience_entries",
    titleField: "role",
    subtitleField: "company",
    orderBy: "sort_order",
    fixedValues: { kind: "volunteer" },
    filter: { kind: "volunteer" },
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Organization", type: "text", required: true },
      { name: "start_date", label: "Start", type: "text", required: true },
      { name: "end_date", label: "End", type: "text", required: true },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "ventures",
    label: "Ventures",
    table: "ventures",
    titleField: "name",
    subtitleField: "role",
    orderBy: "sort_order",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Your role", type: "text", required: true },
      { name: "start_date", label: "Start", type: "text", required: true },
      { name: "end_date", label: "End", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    table: "skill_groups",
    titleField: "label",
    orderBy: "sort_order",
    fields: [
      { name: "label", label: "Group label", type: "text", required: true },
      { name: "skills", label: "Skills (one per line)", type: "lines" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "articles",
    label: "Writing",
    table: "articles",
    titleField: "title",
    subtitleField: "category",
    orderBy: "sort_order",
    imageField: "image_url",
    toggleField: { name: "published", onLabel: "Published", offLabel: "Draft" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (URL: /blog/…)", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "reading_time", label: "Reading time (e.g. \"8 min read\")", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "tags", label: "Tags (one per line)", type: "lines" },
      { name: "outline", label: "Outline (one point per line, shown while unpublished)", type: "lines" },
      { name: "image", label: "Hero image", type: "image" },
      { name: "body_markdown", label: "Article body (Markdown)", type: "markdown" },
      { name: "published", label: "Published (visible on the public site)", type: "boolean" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "publications",
    label: "Publications",
    table: "publications",
    titleField: "title",
    subtitleField: "kind",
    orderBy: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "kind", label: "Kind", type: "select", options: ["Book", "Paper", "IP"], required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "achievements",
    label: "Achievements",
    table: "achievements",
    titleField: "title",
    subtitleField: "org",
    orderBy: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "org", label: "Organization / detail", type: "text", required: true },
      { name: "featured", label: "Featured (large hero card)", type: "boolean" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
  {
    key: "certifications",
    label: "Certifications",
    table: "certifications",
    titleField: "title",
    orderBy: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "sort_order", label: "Sort order (lower = earlier)", type: "number" },
    ],
  },
];

export function getEntity(key: string): EntityConfig | undefined {
  return entities.find((e) => e.key === key);
}
