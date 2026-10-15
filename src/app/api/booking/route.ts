// app/api/booking/route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";
import ical from "ical-generator";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    email,
    phone,
    date,
    time,
    service,
  } = body;

  // combine date/time
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const calendar = ical({
    name: "Booking",
  });

  calendar.createEvent({
    start,
    end,
    summary: `${service} with Joshua Xavier`,
    description: `Booking for ${name}`,
    organizer: {
      name: "Joshua Xavier",
      email: "josh@modevz.ca",
    },
  });

  const ics = calendar.toString();

  // email yourself

  await resend.emails.send({
    from: "Bookings <bookings@modevz.ca>",
    to: "josh@modevz.ca",
    subject: `New Booking - ${name}`,
    html: `
      <h2>New Booking</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Service:</strong> ${service}</p>
    `,
  });

  // confirmation email

  await resend.emails.send({
    from: "Joshua Xavier <josh@modevz.ca>",
    to: email,
    subject: "Your booking confirmation",
    html: `
      <h2>You're booked!</h2>

      <p>Thanks ${name}.</p>

      <p>
        Your <strong>${service}</strong> is scheduled for
        <strong>${date}</strong> at
        <strong>${time}</strong>.
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