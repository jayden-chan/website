import { readFileSync, writeFileSync } from "fs";

export function e(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("--", "&#8212;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const templateReplace = (
  path: string,
  replacements: Record<string, string>
) => {
  let file = readFileSync(path, { encoding: "utf8" });

  Object.entries(replacements).forEach(([key, val]) => {
    file = file.replaceAll(key, val);
  });

  writeFileSync(path, file);
};
