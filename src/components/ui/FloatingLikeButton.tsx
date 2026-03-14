'use client';

import React, { useEffect, useState } from 'react';
import { useLikes } from '../../context/LikesContext';

const FloatingLikeButton: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading || count === null}
      aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
      aria-pressed={liked}
      style={{
        position: 'fixed',
        right: '1.5rem',
        bottom: '2rem',
        transform: `scale(${pulse ? 1.15 : 1})`,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.65rem 1rem',
        background: liked
          ? 'var(--color-primary)'
          : 'var(--color-bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${liked ? 'var(--color-primary)' : 'var(--color-border, rgba(255,255,255,0.15))'}`,
        borderRadius: '2rem',
        cursor: liked || count === null ? 'default' : loading ? 'wait' : 'pointer',
        color: liked ? '#fff' : 'var(--color-text-muted)',
        boxShadow: liked
          ? '0 4px 20px color-mix(in srgb, var(--color-primary) 50%, transparent)'
          : '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'opacity 0.4s ease, transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      <span style={{
        fontSize: '1.1rem',
        lineHeight: 1,
        display: 'block',
        transition: 'transform 0.25s ease',
        transform: pulse ? 'scale(1.4)' : 'scale(1)',
      }}>
        {liked ? '♥' : '♡'}
      </span>
      {count !== null && (
        <span className="mono" style={{ fontSize: '0.75rem', lineHeight: 1, fontWeight: 600 }}>
          {liked ? `${count} liked` : count > 0 ? `${count}` : 'Like'}
        </span>
      )}
    </button>
  );
};

export default FloatingLikeButton;
