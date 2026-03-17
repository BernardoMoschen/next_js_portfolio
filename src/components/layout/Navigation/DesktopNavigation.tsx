import React, { useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import { ThemeToggle } from '../../theme';
import { SoundToggle, useSoundContext } from '../../audio';
import LanguageSwitcher from '../LanguageSwitcher';
import { useI18n } from '../../../i18n';

interface MenuItem {
    label: string;
    href: string;
}

interface DesktopNavigationProps {
    menuItems: MenuItem[];
    activeSection: string;
    onMenuClick: (href: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
    menuItems,
    activeSection,
    onMenuClick,
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { playSound } = useSoundContext();
    const { t } = useI18n();

    return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {menuItems.map((item, index) => {
                const isActive = activeSection === item.href.replace('#', '');
                const isHovered = hoveredIndex === index;

                return (
                    <button
                        key={item.label}
                        onClick={() => onMenuClick(item.href)}
                        onMouseEnter={() => { setHoveredIndex(index); playSound('hover'); }}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            background: isHovered ? 'var(--color-bg-glass)' : 'transparent',
                            color: isActive || isHovered
                                ? 'var(--color-primary)'
                                : 'var(--color-text)',
                            fontWeight: 600,
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.85rem',
                            position: 'relative',
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'translateY(-2px)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <span>{item.label}</span>
                        <span
                            style={{
                                fontSize: '0.6rem',
                                opacity: 0.7,
                                color: 'var(--color-secondary)',
                                lineHeight: 1,
                                marginTop: 2,
                                display: 'inline-block',
                                transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'none',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            [{index.toString().padStart(2, '0')}]
                        </span>
                        {/* Active underline */}
                        <span
                            style={{
                                position: 'absolute',
                                bottom: -4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: isHovered && !isActive ? '40%' : isActive ? '90%' : '0%',
                                height: 2,
                                backgroundColor: 'var(--color-secondary)',
                                borderRadius: 1,
                                boxShadow: isActive ? '0 2px 12px var(--color-secondary)' : 'none',
                                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                            }}
                        />
                    </button>
                );
            })}
            <div
                style={{
                    marginLeft: 16,
                    paddingLeft: 16,
                    borderLeft: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <ThemeToggle />
                <SoundToggle />
                <LanguageSwitcher />
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease, box-shadow 0.2s ease',
                        marginLeft: 8,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(var(--color-primary-rgb, 99,102,241), 0.12)';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 12px rgba(var(--color-primary-rgb, 99,102,241), 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                    }}
                >
                    <HiDownload size={13} />
                    {t.nav.resume}
                </a>
            </div>
        </div>
    );
};

export default DesktopNavigation;
