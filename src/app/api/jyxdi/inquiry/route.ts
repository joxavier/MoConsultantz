import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/jyxdi";
import { escapeHtml, validateInquiry } from "@/lib/jyxdiInquiry";

// Commission and live-painting requests from the Art by Jyxdi site. Each one
// is emailed to the artist with Reply-To set to the customer, so answering
// the email replies to them directly. Sent from the MoDevz domain, which is
// the one verified with Resend.
const FROM = `${SITE.brand} <bookings@modevz.ca>`;

const SUBJECTS = {
  commission: "New commission request",
  "live-paint": "New live painting booking request",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot field: real visitors never see it. Pretend success so bots
  // don't learn to skip it.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ success: true });
  }

  const inquiry = validateInquiry(body);
  if ("error" in inquiry) {
    return NextResponse.json({ error: inquiry.error }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Jyxdi inquiry: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Requests can't be sent right now." }, { status: 503 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = inquiry.fields
    .map(({ label, value }) => `<p><strong>${escapeHtml(label)}:</strong><br/>${escapeHtml(value).replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const { error } = await resend.emails.send({
    from: FROM,
    to: SITE.email,
    replyTo: inquiry.email,
    subject: `${SUBJECTS[inquiry.kind]} - ${inquiry.name}`,
    html: `<h2>${SUBJECTS[inquiry.kind]}</h2>${rows}<p style="color:#888">Sent from ${SITE.siteUrl}. Reply to this email to answer ${escapeHtml(inquiry.name)} directly.</p>`,
  });

  if (error) {
    console.error("Jyxdi inquiry email failed:", error);
    return NextResponse.json({ error: "Your request couldn't be sent." }, { status: 502 });
  }

  // Confirmation to the customer. Their request has already reached the
  // artist, so a failure here isn't reported back as an error.
  await resend.emails
    .send({
      from: FROM,
      to: inquiry.email,
      replyTo: SITE.email,
      subject: `Thanks for your request - ${SITE.brand}`,
      html: `<p>Hi ${escapeHtml(inquiry.name)},</p><p>Thanks for reaching out. Your request has been received and you'll get a reply at this address soon.</p><p>${SITE.brand}<br/><a href="${SITE.instagram}">Instagram</a></p>`,
    })
    .catch((confirmationError) => console.error("Jyxdi confirmation email failed:", confirmationError));

  return NextResponse.json({ success: true });
}
