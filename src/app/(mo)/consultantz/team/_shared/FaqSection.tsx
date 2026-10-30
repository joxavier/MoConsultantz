// FAQ for team pages. The same list feeds the page's FAQPage structured data
// (see faqJsonLd), so answers shown and answers indexed always match.
export type Faq = { question: string; answer: string };

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default function FaqSection({ faqs, title = "Frequently asked questions" }: { faqs: Faq[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" style={{ marginTop: "50px", textAlign: "left" }}>
      <h3 id="faq-title" style={{ fontSize: "24px", marginBottom: "20px", color: "#ffffff", textAlign: "center" }}>❓ {title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq) => (
          <details
            key={faq.question}
            style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", padding: "18px 20px" }}
          >
            <summary style={{ cursor: "pointer", color: "#ffffff", fontWeight: 600, fontSize: "16px" }}>{faq.question}</summary>
            <p style={{ color: "#cccccc", lineHeight: 1.7, marginTop: "12px" }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
