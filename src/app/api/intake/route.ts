import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_OPTIONS,
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
  getRecommendation,
  labelFor,
  type Budget,
  type Goal,
  type Timeline,
} from "@/lib/intake";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, company, phone, goal, budget, timeline } = body as {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    goal: Goal;
    budget: Budget;
    timeline: Timeline;
  };

  if (!name || !email || !goal || !budget || !timeline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { recommendation, downgraded, underMinimum } = getRecommendation(goal, budget);

  await resend.emails.send({
    from: "Assessment <bookings@modevz.ca>",
    to: "josh@modevz.ca",
    subject: `New assessment lead - ${name}${underMinimum ? " (under budget minimum)" : ""}`,
    html: `
      <h2>New Assessment Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "-"}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Goal:</strong> ${labelFor(GOAL_OPTIONS, goal)}</p>
      <p><strong>Budget:</strong> ${labelFor(BUDGET_OPTIONS, budget)}</p>
      <p><strong>Timeline:</strong> ${labelFor(TIMELINE_OPTIONS, timeline)}</p>
      <p><strong>Recommended:</strong> ${recommendation.title}${downgraded ? " (downgraded from requested goal based on budget)" : ""}</p>
      ${underMinimum ? "<p><strong>Note:</strong> Budget is below the $5,000 minimum engagement size.</p>" : ""}
    `,
  });

  if (!underMinimum) {
    await resend.emails.send({
      from: "Joshua Xavier <josh@modevz.ca>",
      to: email,
      subject: "Your MoDevz recommendation",
      html: `
        <h2>Thanks, ${name}.</h2>
        <p>Based on what you shared, the best starting point is the <strong>${recommendation.title}</strong>.</p>
        <p>${recommendation.blurb}</p>
        <p><a href="https://modevz.ca${recommendation.href}">View this service</a></p>
      `,
    });
  }

  return NextResponse.json({ success: true, recommendation, downgraded, underMinimum });
}
