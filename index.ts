const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("onboarding@resend.dev");

if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is required");
if (!RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is required");

async function sendGravityBoxBanEmail(
  email: string,
  days: number,
): Promise<void> {
  const dayLabel = days === 1 ? "day" : "days";
  const text =
    `Your GravityBox account (${email}) has been banned for ${days} ${dayLabel}.`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: onboarding@resend.dev,
      to: [email],
      subject: "Your GravityBox account has been banned",
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ban notification email failed (${response.status})`);
  }
}
