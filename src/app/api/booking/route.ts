// app/api/booking/route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";
import ical from "ical-generator";

const resend = new Resend(process.env.RESEND_API_KEY);

// Who a booking is with. Team pages pass `host`; anything else books with
// Joshua Xavier, as before. `notify` is the inbox that gets the new-booking
// email; `from` is who the client's confirmation comes from.
const HOSTS = {
  joxavier: { name: "Joshua Xavier", notify: "josh@modevz.ca", from: "Joshua Xavier <josh@modevz.ca>" },
  limelight: { name: "Emil Kiruba", notify: "josh@modevz.ca", from: "Mo Bookings <bookings@modevz.ca>" },
} as const;

type HostKey = keyof typeof HOSTS;

// Visitor input goes into email HTML, so escape it.
const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name = text(body?.name, 120);
  const email = text(body?.email, 200);
  const phone = text(body?.phone, 40);
  const date = text(body?.date, 10);
  const time = text(body?.time, 5);
  const service = text(body?.service, 80) || "consultation";
  // Own keys only, so "__proto__" or "toString" can't select a host.
  const hostKey: HostKey = typeof body?.host === "string" && Object.prototype.hasOwnProperty.call(HOSTS, body.host) ? body.host : "joxavier";
  const host = HOSTS[hostKey];

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Please include your name, a valid email, a date and a time." }, { status: 400 });
  }

  // combine date/time
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: "That date or time isn't valid." }, { status: 400 });
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const calendar = ical({
    name: "Booking",
  });

  calendar.createEvent({
    start,
    end,
    summary: `${service} with ${host.name}`,
    description: `Booking for ${name}`,
    organizer: {
      name: host.name,
      email: host.notify,
    },
  });

  const ics = calendar.toString();

  // email the host

  await resend.emails.send({
    from: "Bookings <bookings@modevz.ca>",
    to: host.notify,
    replyTo: email,
    subject: `New Booking with ${host.name} - ${name}`,
    html: `
      <h2>New Booking with ${escapeHtml(host.name)}</h2>

      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p><strong>Time:</strong> ${escapeHtml(time)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
    `,
  });

  // confirmation email

  await resend.emails.send({
    from: host.from,
    to: email,
    subject: "Your booking confirmation",
    html: `
      <h2>You're booked!</h2>

      <p>Thanks ${escapeHtml(name)}.</p>

      <p>
        Your <strong>${escapeHtml(service)}</strong> with ${escapeHtml(host.name)} is scheduled for
        <strong>${escapeHtml(date)}</strong> at
        <strong>${escapeHtml(time)}</strong>.
      </p>
    `,
    attachments: [
      {
        filename: "booking.ics",
        content: Buffer.from(ics).toString("base64"),
      },
    ],
  });

  return NextResponse.json({
    success: true,
  });
}
