import React, { useState, useEffect } from 'react';
import type { ProjectData } from '../../data/projectsData';

interface ProjectPreviewProps {
    project: ProjectData;
    compact?: boolean;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, compact = false }) => {
    const preview = project.preview;
    const [visibleLines, setVisibleLines] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Animate terminal lines when hovered
    useEffect(() => {
        if (!isHovered || !preview?.content) {
            setVisibleLines(0);
            return;
        }

        const lines = preview.content.length;
        let current = 0;
        const interval = setInterval(() => {
            current++;
            setVisibleLines(current);
            if (current >= lines) clearInterval(interval);
        }, 180);

        return () => clearInterval(interval);
    }, [isHovered, preview?.content]);

    if (!preview) return null;

    const height = compact ? 160 : 200;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: 'rgba(0, 0, 0, 0.3)',
                height,
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.3s ease',
                borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-border)',
            }}
        >
            {/* Terminal title bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    flexShrink: 0,
                }}
            >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
                <span
                    className="mono"
                    style={{
                        marginLeft: 8,
                        fontSize: '0.65rem',
                        color: 'var(--color-text-secondary)',
                        opacity: 0.7,
                    }}
                >
                    {project.slug}@preview ~ $
                </span>
            </div>

            {/* Terminal body */}
            <div style={{ flex: 1, padding: '8px 12px', overflow: 'hidden', position: 'relative' }}>
                {preview.content && (
                    <div className="mono" style={{ fontSize: '0.7rem', lineHeight: 1.7 }}>
                        {preview.content.map((line, i) => (
                            <div
                                key={i}
                                style={{
                                    opacity: i < visibleLines ? 1 : 0.15,
                                    transform: i < visibleLines ? 'translateX(0)' : 'translateX(-4px)',
                                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    color: line.startsWith('✓')
                                        ? 'var(--color-success)'
                                        : line.startsWith('→')
                                            ? 'var(--color-text-secondary)'
                                            : 'var(--color-primary)',
                                }}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                )}

                {/* Metrics bar at bottom */}
                {preview.metrics && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 12,
                            right: 12,
                            display: 'flex',
                            gap: 12,
                            justifyContent: 'space-between',
                        }}
                    >
                        {preview.metrics.map((m, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div
                                    className="mono"
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    {m.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.6rem',
                                        color: 'var(--color-text-secondary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {m.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectPreview;
