'use client';

import React, { useState, useEffect } from 'react';
import { useLikes } from '../../context/LikesContext';
import { scrollToTop } from '../layout/Navigation/utils';

const BottomRightHUD: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [showScroll, setShowScroll] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScroll(y > 100);
      setShowLike(y > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const merged = showScroll && showLike;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    right: '1.5rem',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    opacity: showScroll || showLike ? 1 : 0,
    pointerEvents: showScroll || showLike ? 'auto' : 'none',
    transition: 'opacity 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    ...(merged ? {
      background: 'var(--color-bg-glass)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid var(--color-border)',
      borderRadius: '1rem',
      overflow: 'hidden',
      transform: hovered
        ? 'perspective(600px) rotateX(4deg) rotateY(-3deg) scale(1.04)'
        : 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
      boxShadow: hovered
        ? '0 20px 50px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
        : '0 8px 28px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15)',
    } : {
      background: 'transparent',
      border: '1px solid transparent',
      borderRadius: '1rem',
      gap: '0.75rem',
      transform: 'none',
      boxShadow: 'none',
    }),
  };

  const likeRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.1rem',
    background: merged
      ? liked ? 'color-mix(in srgb, var(--color-primary) 18%, transparent)' : 'transparent'
      : liked ? 'var(--color-primary)' : 'var(--color-bg-glass)',
    backdropFilter: merged ? 'none' : 'blur(12px)',
    WebkitBackdropFilter: merged ? 'none' : 'blur(12px)',
    border: merged ? 'none' : `1px solid ${liked ? 'var(--color-primary)' : 'var(--color-border, rgba(255,255,255,0.15))'}`,
    borderRadius: merged ? 0 : '2rem',
    cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
    color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
    boxShadow: merged ? 'none' : liked
      ? '0 4px 20px color-mix(in srgb, var(--color-primary) 50%, transparent)'
      : '0 4px 16px rgba(0,0,0,0.25)',
    userSelect: 'none',
    transition: 'background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
    opacity: showLike ? 1 : 0,
    maxHeight: showLike ? '56px' : '0px',
    overflow: 'hidden',
    transitionProperty: 'opacity, max-height, background, color, box-shadow',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease',
    whiteSpace: 'nowrap',
  };

  const scrollRowStyle: React.CSSProperties = merged ? {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.1rem',
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    transition: 'color 0.2s ease, background 0.2s ease',
    width: '100%',
    whiteSpace: 'nowrap',
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, var(--color-primary) 30%, var(--color-secondary) 90%)',
    color: '#fff',
    border: 'none',
    outline: '2px solid var(--color-border)',
    outlineOffset: '-2px',
    cursor: 'pointer',
    opacity: showScroll ? 1 : 0,
    transform: showScroll ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    alignSelf: 'flex-end',
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => merged && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Like row */}
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || loading || count === null}
        aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
        aria-pressed={liked}
        style={likeRowStyle}
      >
        <span style={{
          fontSize: '1.1rem',
          lineHeight: 1,
          display: 'block',
          transform: pulse ? 'scale(1.4)' : 'scale(1)',
          transition: 'transform 0.25s ease',
        }}>
          {liked ? '♥' : '♡'}
        </span>
        <span className="mono" style={{ fontSize: '0.75rem', lineHeight: 1, fontWeight: 600 }}>
          {liked ? `${count} liked` : count !== null && count > 0 ? `${count}` : 'Like'}
        </span>
      </button>

      {/* Divider — only rendered when merged */}
      {merged && (
        <div style={{ height: '1px', background: 'var(--color-border)', flexShrink: 0 }} />
      )}

      {/* Scroll to top row */}
      <button
        aria-label="Scroll back to top"
        onClick={scrollToTop}
        style={scrollRowStyle}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        {merged && (
          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>top</span>
        )}
      </button>
    </div>
  );
};

export default BottomRightHUD;
