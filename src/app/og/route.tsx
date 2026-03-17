import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import siteConfig from '../../config/site';
import { projects } from '../../components/data/projectsData';

export const runtime = 'edge';

const GRID = 'linear-gradient(rgba(127,176,105,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(127,176,105,0.04) 1px, transparent 1px)';
const ACCENT = 'linear-gradient(90deg, #7fb069, #e07a5f)';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const project = slug ? projects.find((p) => p.slug === slug) : null;

  const title = project ? project.title : siteConfig.name;
  const subtitle = project ? project.description : siteConfig.title;
  const chips = project
    ? (project.technologies ?? []).slice(0, 5)
    : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'];
  const prefix = project
    ? `~/${siteConfig.domain}/projects`
    : `~/${siteConfig.domain}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0f1117',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: GRID, backgroundSize: '48px 48px' }} />

        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ACCENT }} />

        {/* Terminal prompt prefix */}
        <div style={{ display: 'flex', color: '#7fb069', fontSize: '22px', marginBottom: '24px', letterSpacing: '0.05em' }}>
          {prefix}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: project ? '56px' : '72px',
            fontWeight: 700,
            color: '#f0f4f8',
            lineHeight: 1.1,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '24px',
            color: project ? '#a0aec0' : '#7fb069',
            fontWeight: 500,
            marginBottom: '40px',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                background: 'rgba(127,176,105,0.12)',
                border: '1px solid rgba(127,176,105,0.3)',
                color: '#7fb069',
                borderRadius: '6px',
                padding: '6px 16px',
                fontSize: '20px',
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            color: 'rgba(240,244,248,0.25)',
            fontSize: '20px',
            letterSpacing: '0.05em',
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
