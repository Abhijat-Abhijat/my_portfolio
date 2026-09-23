import { ImageResponse } from "next/og";

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
          background: "#0a0a0b",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: 22, letterSpacing: 4, color: "#3d7dff", textTransform: "uppercase" }}>
          {SITE_NAME}
        </span>
        <span style={{ fontSize: 62, marginTop: 24, fontWeight: 600, maxWidth: 900, lineHeight: 1.1 }}>
          I build useful software and AI products.
        </span>
        <span style={{ fontSize: 26, marginTop: 28, color: "#9a9aa2", maxWidth: 820 }}>
          {SITE_ROLE}
        </span>
      </div>
    ),
    { ...size }
  );
}
