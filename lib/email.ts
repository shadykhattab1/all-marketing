import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendCampaignReport(
  to: string,
  campaignId: string,
  brandName: string
): Promise<{ success: boolean; reason?: string }> {
  if (!resend) return { success: false, reason: "email not configured" };

  await resend.emails.send({
    from: "All Marketing <reports@allmarketing.ai>",
    to,
    subject: `Campaign Report: ${brandName}`,
    html: `
      <h1>Campaign Report</h1>
      <p>Your campaign report for <strong>${brandName}</strong> is ready.</p>
      <p>Campaign ID: <code>${campaignId}</code></p>
    `,
  });

  return { success: true };
}
