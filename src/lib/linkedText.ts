// Bio text can hold links written as [label](https://...). Only https links
// become links; anything else is left as plain text.
export type TextPart = { text: string; href?: string };
// URLs may contain one level of brackets, as Wikipedia's often do: _(actor).
const LINK_PATTERN = /\[([^\]\n]+)\]\((https:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/g;

export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of Array.from(text.matchAll(LINK_PATTERN))) {
    if (match.index! > last) parts.push({ text: text.slice(last, match.index) });
    parts.push({ text: match[1], href: match[2] });
    last = match.index! + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

export const stripLinks = (text: string) => splitLinks(text).map((part) => part.text).join("");
