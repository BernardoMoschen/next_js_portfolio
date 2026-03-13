import React from 'react';

interface BrandLogoProps {
    trigger: boolean;
    onClick: () => void;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ trigger, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
        >
            {/* Terminal icon SVG */}
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    marginRight: 8,
                    opacity: trigger ? 1 : undefined,
                    animation: trigger ? 'none' : 'pulse 2s infinite',
                }}
            >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <div>
                <div
                    className="mono"
                    style={{
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        fontFamily: '"JetBrains Mono", monospace',
                        lineHeight: 1,
                        fontSize: '1.15rem',
                    }}
                >
                    bernardo.moschen
                </div>
                <div
                    className="mono"
                    style={{
                        color: 'var(--color-secondary)',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        opacity: trigger ? 0.8 : 0.6,
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    {'{ fullstack.engineer }'}
                </div>
            </div>
        </div>
    );
};

export default BrandLogo;
