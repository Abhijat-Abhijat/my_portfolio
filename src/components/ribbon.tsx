const WORDS = ["designer", "builder", "writer", "debugger", "tinkerer", "tea person", "AI engineer", "notebook hoarder"];

export function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-track">
        {[0, 1].flatMap((copy) => WORDS.map((w) => <span key={`${copy}-${w}`}>{w}</span>))}
      </div>
    </div>
  );
}
