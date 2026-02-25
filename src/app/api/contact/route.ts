import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = (await req.json()) as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: `${SITE_NAME} <orders@maisonisivis.com>`,
      to: "connect@maisonisivis.com",
      replyTo: email,
      subject: `Contact: ${subject}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D0033; font-family: Georgia, serif;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151; width: 120px;">Name</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">
                <a href="mailto:${email}" style="color: #0033CC;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Subject</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151; vertical-align: top;">Message</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
            Reply directly to this email to respond to the customer.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
