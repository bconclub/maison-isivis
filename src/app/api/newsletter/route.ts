import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Save to Supabase newsletter_subscribers table
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, subscribed: true, source: "footer" },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("[Newsletter] DB error:", dbError);
    }

    // Send notification to admin
    resend.emails.send({
      from: `${SITE_NAME} <orders@maisonisivis.com>`,
      to: "connect@maisonisivis.com",
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D0033; font-family: Georgia, serif;">New Newsletter Subscriber</h2>
          <p style="font-size: 15px; color: #4B5563; margin-top: 12px;">
            <strong>${email}</strong> has subscribed to the newsletter.
          </p>
          <p style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
            Subscribed via the website footer.
          </p>
        </div>
      `,
    }).catch((err) => console.error("[Newsletter] Email error:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
