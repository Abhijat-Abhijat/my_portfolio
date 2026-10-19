// `section` marks the standalone route a link belongs to, so the header can show
// which part of the site you're on.
export const navLinks = [
  { label: "Work", href: "/#work", section: "/projects" },
  { label: "About", href: "/#about", section: null },
  { label: "Toolbox", href: "/#tools", section: null },
  { label: "Journal", href: "/#journal", section: "/experience" },
  { label: "Notes", href: "/#notes", section: "/blog" },
  { label: "Say hi", href: "/#contact", section: null },
] as const;
