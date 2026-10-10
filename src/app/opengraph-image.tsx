import { ImageResponse } from "next/og";
import { BRAND, MARK_A_PATH, MARK_DOT, MARK_VIEWBOX } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_NAME = "Abhijat";
const SITE_ROLE = "AI Engineer · Full-Stack Software Engineer · Published Author";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: BRAND.paper,
          color: BRAND.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={64} height={64} viewBox={MARK_VIEWBOX}>
            <rect width="32" height="32" rx="9" fill={BRAND.ink} />
            <path d={MARK_A_PATH} fill={BRAND.paper} fillRule="evenodd" />
            <circle cx={MARK_DOT.cx} cy={MARK_DOT.cy} r={MARK_DOT.r} fill={BRAND.accent} />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_NAME}
            <span style={{ color: BRAND.accent }}>.</span>
          </span>
        </div>
        <span style={{ fontSize: 68, marginTop: 48, fontWeight: 700, maxWidth: 940, lineHeight: 1.05, letterSpacing: -2 }}>
          I build useful software and AI products.
        </span>
        <span style={{ fontSize: 26, marginTop: 28, color: "#505b6c", maxWidth: 820 }}>{SITE_ROLE}</span>
      </div>
    ),
    { ...size }
  );
}
