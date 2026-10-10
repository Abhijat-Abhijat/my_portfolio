import { ImageResponse } from "next/og";
import { BRAND, MARK_A_PATH, MARK_DOT, MARK_VIEWBOX } from "@/lib/brand";

/** "A." monogram tile as a PNG response — used by app/icon.tsx and app/apple-icon.tsx. */
export function markImage(px: number) {
  return new ImageResponse(
    (
      <svg width={px} height={px} viewBox={MARK_VIEWBOX}>
        <rect width="32" height="32" rx="9" fill={BRAND.ink} />
        <path d={MARK_A_PATH} fill={BRAND.paper} fillRule="evenodd" />
        <circle cx={MARK_DOT.cx} cy={MARK_DOT.cy} r={MARK_DOT.r} fill={BRAND.accent} />
      </svg>
    ),
    { width: px, height: px }
  );
}
