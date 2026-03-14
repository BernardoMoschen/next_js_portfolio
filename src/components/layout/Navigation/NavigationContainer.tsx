import React, { useState, useEffect, useRef, useCallback } from 'react';

import MobileNavigation from './MobileNavigation';
import DesktopNavigation from './DesktopNavigation';
import BrandLogo from './BrandLogo';
import { menuItems, scrollToSection } from './utils';
import { useI18n } from '../../../i18n';

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
        handler(mql);
        mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
        return () => mql.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
    }, [breakpoint]);

    return isMobile;
}

const NavigationContainer: React.FC = () => {
    const isMobile = useIsMobile();
    const { t } = useI18n();

    const navLabelMap: Record<string, string> = {
        Home: t.nav.home,
        About: t.nav.about,
        Projects: t.nav.projects,
        Certifications: t.certifications.nav,
        Contact: t.nav.contact,
    };
    const translatedMenuItems = menuItems.map(item => ({
        ...item,
        label: navLabelMap[item.label] || item.label,
    }));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [scrolled, setScrolled] = useState(false);
    const rafId = useRef(0);

    // Single consolidated scroll handler using rAF throttle
    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 100);

            // Track active section
            const sections = ['hero', 'about', 'projects', 'certifications', 'contact'];
            const scrollPosition = scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId.current);
        };
    }, [handleScroll]);

    const handleMenuClick = (sectionId: string) => {
        scrollToSection(sectionId);
        setMobileOpen(false);
    };

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    backgroundColor: scrolled ? 'var(--color-bg-glass)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
                    boxShadow: scrolled
                        ? '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)'
                        : 'none',
                    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Top accent line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: scrolled
                            ? 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-primary) 100%)'
                            : 'transparent',
                        opacity: scrolled ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />

                <nav
                    aria-label="Main navigation"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: isMobile ? 64 : 72,
                        padding: '0 24px',
                        maxWidth: 1200,
                        margin: '0 auto',
                        width: '100%',
                    }}
                >
                    <BrandLogo trigger={scrolled} onClick={() => scrollToSection('#hero')} />
                    {isMobile ? (
                        <MobileNavigation
                            open={mobileOpen}
                            onToggle={() => setMobileOpen(!mobileOpen)}
                            onMenuClick={handleMenuClick}
                            activeSection={activeSection}
                            menuItems={translatedMenuItems}
                        />
                    ) : (
                        <DesktopNavigation
                            menuItems={translatedMenuItems}
                            activeSection={activeSection}
                            onMenuClick={handleMenuClick}
                        />
                    )}
                </nav>
            </header>
        </>
    );
};

export default NavigationContainer;
