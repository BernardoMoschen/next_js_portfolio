import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import siteConfig from '../../../config/site';
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, FIELD_MAX_LENGTHS } from '../../../config/api';
import { EMAIL_REGEX } from '../../../utils/validation';

const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimit.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) return 'unknown';
  return forwardedFor.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, subject, message, website } = body as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      website?: unknown;
    };

    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedSubject = subject.trim();
    const normalizedMessage = message.trim();

    if (!normalizedName || !normalizedEmail || !normalizedSubject || !normalizedMessage) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (
      normalizedName.length > FIELD_MAX_LENGTHS.name ||
      normalizedEmail.length > FIELD_MAX_LENGTHS.email ||
      normalizedSubject.length > FIELD_MAX_LENGTHS.subject ||
      normalizedMessage.length > FIELD_MAX_LENGTHS.message
    ) {
      return NextResponse.json({ error: 'Field length exceeds limit' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Contact form misconfiguration: missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
    }

    const resend = new Resend(resendApiKey);

    const safeName = escapeHtml(normalizedName);
    const safeEmail = escapeHtml(normalizedEmail);
    const safeSubject = escapeHtml(normalizedSubject);
    const safeMessage = escapeHtml(normalizedMessage);

    const emailResponse = await resend.emails.send({
      from: `Portfolio Contact <contact@${siteConfig.domain}>`,
      to: siteConfig.email,
      subject: `Portfolio Contact: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #2d5a27; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d5a27;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Reply directly to this email to respond to ${safeName}.</p>
          </div>
        </div>
      `,
      replyTo: normalizedEmail,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      id: emailResponse.data?.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
