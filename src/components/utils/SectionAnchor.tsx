import React, { useState } from 'react';

interface SectionAnchorProps {
    sectionId: string;
}

const SectionAnchor: React.FC<SectionAnchorProps> = ({ sectionId }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const url = `${window.location.origin}/#${sectionId}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard permission denied — silent fail
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="section-anchor"
            aria-label={`Copy link to ${sectionId} section`}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75em',
                color: 'var(--color-text-secondary)',
                opacity: 0,
                transition: 'opacity 0.2s ease, color 0.2s ease',
                padding: '0 0.4em',
                position: 'relative',
            }}
        >
            {copied ? '✓' : '#'}
            {copied && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-1.8em',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.7rem',
                        color: 'var(--color-success)',
                        whiteSpace: 'nowrap',
                        animation: 'fade-up 1.5s ease forwards',
                    }}
                >
                    copied!
                </span>
            )}
        </button>
    );
};

export default SectionAnchor;
