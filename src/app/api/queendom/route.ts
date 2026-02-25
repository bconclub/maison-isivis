import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instagram, email, phone, message } = body as {
      instagram: string;
      email: string;
      phone: string;
      message: string;
    };

    if (!instagram || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Send notification email to admin
    const { error } = await resend.emails.send({
      from: `${SITE_NAME} <orders@maisonisivis.com>`,
      to: "connect@maisonisivis.com",
      subject: `New Queendom Application — @${instagram}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D0033; font-family: Georgia, serif;">New Queendom Application</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151; width: 180px;">Instagram</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">
                <a href="https://instagram.com/${instagram.replace("@", "")}" style="color: #0033CC;">@${instagram.replace("@", "")}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">
                <a href="mailto:${email}" style="color: #0033CC;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151;">Phone</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">${phone}</td>
            </tr>
            ${
              message
                ? `<tr>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #374151; vertical-align: top;">Why They Want to Join</td>
              <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; color: #4B5563; white-space: pre-wrap;">${message}</td>
            </tr>`
                : ""
            }
          </table>
          <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
            Submitted via maisonisivis.com/join-the-queendom
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Queendom] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Queendom] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
