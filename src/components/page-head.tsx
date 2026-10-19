import Link from "next/link";

/** Sub-page header: back link, handwritten kicker, serif title with one italic word. */
export function PageHead({
  back,
  backLabel,
  kicker,
  title,
  ital,
  children,
  glue = false,
}: {
  back: string;
  backLabel: string;
  kicker: string;
  title: string;
  ital?: string;
  children?: React.ReactNode;
  glue?: boolean;
}) {
  return (
    <header className="page-head">
      <div className="container-page">
        <Link href={back} className="tlink text-sm">
          ← {backLabel}
        </Link>
        <div className="mt-10">
          <span className="kicker">{kicker}</span>
          <h1 className="h2 text-balance">
            {title}
            {ital && (
              <>
                {!glue && " "}
                <span className="ital mc">{ital}</span>
              </>
            )}
          </h1>
          {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{children}</div>}
        </div>
      </div>
    </header>
  );
}
