import { splitLinks } from "@/lib/jyxdi";

// Renders text containing [label](https://...) links, e.g. the bio.
export default function LinkedText({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text).map((part, i) =>
        part.href ? (
          <a key={i} href={part.href} target="_blank" rel="noopener" className="underline decoration-[var(--jx-accent)] decoration-2 underline-offset-4 hover:text-[var(--jx-accent)]">
            {part.text}
          </a>
        ) : (
          part.text
        )
      )}
    </>
  );
}
