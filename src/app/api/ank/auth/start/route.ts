import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CHALLENGE_COOKIE,
  CODE_TTL_SECONDS,
  cookieOptions,
  createChallenge,
  findAccount,
  formatCode,
  generateCode,
  isAuthConfigured,
  normalizeEmail,
  rateLimited,
} from "@/lib/ankAuth";
import { addToNewsletter } from "@/lib/newsletter";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step 1 of Ank sign-in. An account email (ANK_ACCOUNTS) is sent a one-time
// code; any other email joins the launch newsletter.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`start:${email}`, 5, 15 * 60) || rateLimited(`start-ip:${ip}`, 20, 15 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  const account = findAccount(email);

  if (!account) {
    try {
      await addToNewsletter(email, "Ank waitlist");
    } catch (error: any) {
      console.error("Ank waitlist signup failed:", error.message);
      return NextResponse.json({ error: "We couldn't add you to the list right now. Please try again later." }, { status: 502 });
    }
    return NextResponse.json({ status: "waitlist" });
  }

  if (!isAuthConfigured() || !process.env.RESEND_API_KEY) {
    console.error("Ank sign-in: ANK_AUTH_SECRET/NEXTAUTH_SECRET or RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Sign-in isn't available right now." }, { status: 503 });
  }

  const code = generateCode();
  const { token } = createChallenge(account.email, code);

  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "Ank <bookings@modevz.ca>",
    to: account.email,
    subject: `Your Ank sign-in code: ${formatCode(code)}`,
    html: `<p>Your Ank sign-in code is:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:4px;font-family:monospace">${formatCode(code)}</p>
<p>It expires in ${CODE_TTL_SECONDS / 60} minutes. If you didn't try to sign in, you can ignore this email.</p>`,
  });

  if (error) {
    console.error("Ank sign-in code email failed:", error);
    return NextResponse.json({ error: "We couldn't send your code. Please try again." }, { status: 502 });
  }

  const response = NextResponse.json({ status: "code" });
  response.cookies.set(CHALLENGE_COOKIE, token, cookieOptions(CODE_TTL_SECONDS));
  return response;
}
