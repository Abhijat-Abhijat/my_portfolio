import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[80vh] items-center gap-10 pb-24 pt-32 md:grid-cols-2">
      <div>
        <span className="kicker">404 — well, this is awkward</span>
        <h1 className="h2 text-balance">
          Nothing built <span className="ital mc">here</span> yet.
        </h1>
        <p className="mt-5 max-w-md text-lg text-fg-muted">That page moved, got renamed, or never existed. Even the map is upside down.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/" className="btn-ink">
            ← Take me home
          </Link>
          <Link href="/projects" className="tlink">
            or browse the work
          </Link>
        </div>
      </div>
      <Image src="/avatars/lost.webp" alt="Illustrated Abhijat holding a map upside down" width={600} height={600} className="sticker-img mx-auto w-[min(100%,440px)]" priority />
    </div>
  );
}
