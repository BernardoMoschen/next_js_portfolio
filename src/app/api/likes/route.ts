import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const LIKES_KEY = 'likes:total';
const IP_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function GET() {
  try {
    const count = (await kv.get<number>(LIKES_KEY)) ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const ipKey = `likes:ip:${ip}`;

  try {
    const alreadyLiked = await kv.exists(ipKey);
    if (alreadyLiked) {
      const count = (await kv.get<number>(LIKES_KEY)) ?? 0;
      return NextResponse.json({ count, alreadyLiked: true }, { status: 409 });
    }

    const [count] = await Promise.all([
      kv.incr(LIKES_KEY),
      kv.set(ipKey, 1, { ex: IP_TTL_SECONDS }),
    ]);

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
