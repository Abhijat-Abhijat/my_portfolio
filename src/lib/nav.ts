// `section` marks the standalone route a link belongs to, so the header can show
// which part of the site you're on.
export const navLinks = [
  { label: "Work", href: "/#work", section: "/projects" },
  { label: "About", href: "/#about", section: null },
  { label: "Writing", href: "/#writing", section: "/blog" },
  { label: "Experience", href: "/#experience", section: "/experience" },
  { label: "Contact", href: "/#contact", section: null },
] as const;
