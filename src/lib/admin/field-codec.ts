// Converts between form-friendly text (what an admin types into a textarea)
// and the JSON/array shapes the database columns actually store.

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(arr: string[] | null | undefined): string {
  return (arr ?? []).join("\n");
}

export function pairsToArray(
  text: string,
  keys: [string, string]
): Array<Record<string, string>> {
  return linesToArray(text).map((line) => {
    const [left, ...rest] = line.split("|");
    return {
      [keys[0]]: (left ?? "").trim(),
      [keys[1]]: rest.join("|").trim(),
    };
  });
}

export function arrayToPairs(
  arr: Array<Record<string, string>> | null | undefined,
  keys: [string, string]
): string {
  return (arr ?? []).map((o) => `${o[keys[0]] ?? ""} | ${o[keys[1]] ?? ""}`).join("\n");
}
