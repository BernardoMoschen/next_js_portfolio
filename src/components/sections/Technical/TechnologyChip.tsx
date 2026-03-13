import React from 'react';
import type { Technology } from '../../data/aboutData';
import { getTechnologyIcon } from '../../utils/iconMap';

interface TechnologyChipProps {
    technology: Technology;
}

const TechnologyChip: React.FC<TechnologyChipProps> = ({ technology }) => {
    return (
        <span
            className="tag"
            style={{
                padding: '0.15rem 0.5rem',
                background: `linear-gradient(135deg, ${technology.iconColor}12 0%, ${technology.iconColor}06 100%)`,
                border: `1px solid ${technology.iconColor}30`,
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = `linear-gradient(135deg, ${technology.iconColor}20 0%, ${technology.iconColor}12 100%)`;
                el.style.borderColor = technology.iconColor;
                el.style.transform = 'translateY(-1px) scale(1.02)';
                el.style.boxShadow = `0 3px 8px ${technology.iconColor}25`;
            }}
            onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = `linear-gradient(135deg, ${technology.iconColor}12 0%, ${technology.iconColor}06 100%)`;
                el.style.borderColor = `${technology.iconColor}30`;
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = 'none';
            }}
        >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
            >
                <span style={{ width: 12, height: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getTechnologyIcon(technology.iconType, technology.iconColor)}
                </span>
            </span>
            <span style={{ letterSpacing: '0.02em' }}>
                {technology.name}
            </span>
        </span>
    );
};

export default TechnologyChip;
