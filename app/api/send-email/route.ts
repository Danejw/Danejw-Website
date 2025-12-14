import { NextRequest, NextResponse } from 'next/server';

// Simple HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, projectDetails } = body;

    // Validate required fields
    if (!name || !email || !projectDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use Resend API to send email
    // You'll need to set RESEND_API_KEY in your environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Sanitize inputs
    const sanitizedName = escapeHtml(name.trim());
    const sanitizedEmail = escapeHtml(email.trim());
    const sanitizedProjectDetails = escapeHtml(projectDetails.trim());

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>', // Update this with your verified domain in production
        to: ['yourindie101@gmail.com'],
        replyTo: email, // Allow replying directly to the sender
        subject: `New Contact Form Submission from ${sanitizedName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 20px;">
              New Contact Form Submission
            </h2>
            <div style="margin-top: 20px;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${sanitizedName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #06b6d4;">${sanitizedEmail}</a></p>
              <div style="margin-top: 20px;">
                <strong>Project Details:</strong>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; line-height: 1.6;">
                  ${sanitizedProjectDetails.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}

Project Details:
${sanitizedProjectDetails}
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Resend API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    const data = await emailResponse.json();

    return NextResponse.json(
      { message: 'Email sent successfully', id: data.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
