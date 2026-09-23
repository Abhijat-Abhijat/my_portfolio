import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Static by design, not fetched from Supabase: this metadata (and /admin/login)
// must render even before a Supabase project is configured or seeded.
// Site content (hero text, contact links, etc. shown ON the page) is editable
// via /admin — these SEO/OG fallback strings are a source-code-only edit.
const SITE_NAME = "Abhijat";
const SITE_URL = "https://abhijat.co.in";
const SITE_TITLE = `${SITE_NAME} — AI Engineer & Full-Stack Software Engineer`;
const SITE_DESCRIPTION =
  "AI engineer and full-stack developer building production systems, intelligent workflows, and developer tools — and sharing what I learn along the way.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: "I build useful software and AI products, and share what I learn.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "I build useful software and AI products, and share what I learn.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  // Fill in once you've added the site in Google Search Console / Bing Webmaster
  // Tools — each gives you a one-line HTML-tag verification code. Paste just the
  // `content` value into .env.local; no code change needed.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <style>{`.reveal, .hero-in { opacity: 1 !important; transform: none !important; animation: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
