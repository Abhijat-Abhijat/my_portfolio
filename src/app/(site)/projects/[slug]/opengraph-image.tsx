import { ImageResponse } from "next/og";
import { getProject } from "@/lib/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_NAME = "Abhijat";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

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
          background: "#f5efe4",
          color: "#1a1714",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: 20, letterSpacing: 3, color: "#d6420c", textTransform: "uppercase" }}>
          {project?.category ?? SITE_NAME}
        </span>
        <span style={{ fontSize: 66, marginTop: 20, fontWeight: 600, maxWidth: 950, lineHeight: 1.08 }}>
          {project?.title ?? "Project"}
        </span>
        <span style={{ fontSize: 26, marginTop: 26, color: "#574f46", maxWidth: 880, lineHeight: 1.4 }}>
          {project?.description ?? ""}
        </span>
        <span style={{ fontSize: 20, marginTop: 40, color: "#63636b" }}>{SITE_NAME}</span>
      </div>
    ),
    { ...size }
  );
}
