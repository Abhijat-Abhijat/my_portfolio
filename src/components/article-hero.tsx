import { ProjectCover } from "@/components/project-cover";

// Same collage art as project covers (or the uploaded hero image), so writing and
// work share one visual language. Palette from the slug, not list position.
function seed(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function ArticleHero({ slug, imageUrl, title }: { slug: string; imageUrl?: string | null; title: string }) {
  return (
    <div className="cover aspect-[16/7]">
      <div className="cover-in">
        <ProjectCover project={{ slug, title, imageUrl: imageUrl ?? null }} index={seed(slug)} sizes="(min-width: 768px) 760px, 100vw" priority showTitle={false} />
      </div>
    </div>
  );
}
