import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import siteConfig from '../../config/site';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Simple in-memory rate limiter (per Vercel function instance)
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) ?? [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  rateLimit.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

/** Escape HTML entities to prevent XSS in the email body */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limit by IP
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
        { status: 429, headers: jsonHeaders }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot check — bots fill the hidden "website" field
    if (website) {
      // Return fake success so bot doesn't retry
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { status: 200, headers: jsonHeaders }
      );
    }

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Length limits
    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Field length exceeds limit' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Sanitize all user input before embedding in HTML email
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim());

    const emailResponse = await resend.emails.send({
      from: `Portfolio Contact <${siteConfig.email}>`,
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
      replyTo: email.trim(),
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: jsonHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        id: emailResponse.data?.id,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
