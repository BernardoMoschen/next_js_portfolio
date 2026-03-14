'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLikes } from '../../context/LikesContext';
import { scrollToTop } from '../layout/Navigation/utils';

const BottomRightHUD: React.FC = () => {
  const { count, liked, loading, pulse, handleLike } = useLikes();
  const [scrollDepth, setScrollDepth] = useState(0);
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState<'scroll' | 'like' | null>(null);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollDepth(total > 0 ? Math.round((y / total) * 100) : 0);
      setShow(y > 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(id);
  }, []);

  const onLikeClick = useCallback(() => {
    if (!liked && !loading && count !== null) handleLike();
  }, [liked, loading, count, handleLike]);

  return (
    <>
      <style>{`
        @keyframes accentGlow {
          0%, 100% { box-shadow: -1px 0 12px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 16px 40px rgba(0,0,0,0.55); }
          50%       { box-shadow: -1px 0 20px color-mix(in srgb, var(--color-secondary) 40%, transparent), 0 16px 40px rgba(0,0,0,0.55); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.7); }
          65%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes valueFlash {
          0%   { color: var(--color-secondary); }
          100% { color: var(--color-primary); }
        }
        .hud-root {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.73rem;
          line-height: 1;
          position: fixed;
          bottom: 2rem;
          right: 1.5rem;
          z-index: 1000;
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .hud-panel {
          background: rgba(7, 7, 9, 0.93);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 2.5px solid var(--color-primary);
          border-radius: 7px;
          overflow: hidden;
          min-width: 210px;
          animation: accentGlow 4s ease-in-out infinite;
        }
        .hud-titlebar {
          padding: 5px 11px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .hud-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
        .hud-filename {
          margin-left: 8px;
          color: rgba(255,255,255,0.18);
          font-size: 0.61rem;
          letter-spacing: 0.04em;
        }
        .hud-row {
          padding: 8px 11px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background 0.12s ease;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
        }
        .hud-row:hover { background: rgba(127,176,105,0.06); }
        .hud-row.like:hover { background: rgba(255,138,80,0.06); }
        .hud-row.liked-state { background: rgba(127,176,105,0.04); }
        .hud-prompt { color: var(--color-secondary); font-size: 0.65rem; flex-shrink: 0; }
        .hud-key { color: rgba(240,246,252,0.38); flex-shrink: 0; }
        .hud-eq  { color: rgba(240,246,252,0.18); flex-shrink: 0; }
        .hud-val { color: var(--color-primary); font-weight: 700; }
        .hud-val-liked { animation: valueFlash 0.3s ease forwards; }
        .hud-heart {
          margin-left: auto;
          font-size: 1rem;
          flex-shrink: 0;
          transition: color 0.25s ease, filter 0.25s ease;
        }
        .hud-hint {
          padding: 4px 11px 5px;
          border-top: 1px solid rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.16);
          font-size: 0.6rem;
          font-style: italic;
          letter-spacing: 0.01em;
        }
        .hud-divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 0 11px;
        }
      `}</style>

      <div
        className="hud-root"
        style={{
          opacity: show ? 1 : 0,
          pointerEvents: show ? 'auto' : 'none',
          transform: show ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        <div className="hud-panel">

          {/* ── Title bar ── */}
          <div className="hud-titlebar">
            <span className="hud-dot" style={{ background: '#ff5f57' }} />
            <span className="hud-dot" style={{ background: '#febc2e' }} />
            <span className="hud-dot" style={{ background: '#28c840' }} />
            <span className="hud-filename">portfolio.state</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.12)', fontSize: '0.58rem' }}>
              {blink ? '▌' : ' '}
            </span>
          </div>

          {/* ── scrollDepth row ── */}
          <div
            className="hud-row"
            onClick={scrollToTop}
            onMouseEnter={() => setHover('scroll')}
            onMouseLeave={() => setHover(null)}
            title="click to scroll to top"
          >
            <span className="hud-prompt">{hover === 'scroll' ? '►' : '▷'}</span>
            <span className="hud-key">scrollDepth</span>
            <span className="hud-eq">=</span>
            <span className="hud-val">{scrollDepth}<span style={{ color: 'rgba(127,176,105,0.6)', fontWeight: 400 }}>%</span></span>
            {hover === 'scroll' && (
              <span style={{ marginLeft: 'auto', color: 'var(--color-secondary)', fontSize: '0.8rem' }}>↑</span>
            )}
          </div>

          <div className="hud-divider" />

          {/* ── likes row ── */}
          <div
            className={`hud-row like${liked ? ' liked-state' : ''}`}
            onClick={onLikeClick}
            onMouseEnter={() => setHover('like')}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: liked || count === null ? 'default' : 'pointer' }}
          >
            <span className="hud-prompt">{hover === 'like' ? '►' : '▷'}</span>
            <span className="hud-key">likes</span>
            <span className="hud-eq">=</span>
            <span className={`hud-val${pulse ? ' hud-val-liked' : ''}`}>
              {count ?? '…'}
            </span>
            <span
              className="hud-heart"
              style={{
                color: liked ? 'var(--color-primary)' : 'rgba(240,246,252,0.25)',
                filter: liked ? 'drop-shadow(0 0 6px var(--color-primary))' : 'none',
                animation: pulse ? 'heartPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275)' : 'none',
              }}
            >
              {liked ? '♥' : '♡'}
            </span>
          </div>

          {/* ── Hint line (only on hover) ── */}
          {hover && (
            <div className="hud-hint">
              {hover === 'scroll'
                ? '// click → scroll to top'
                : liked
                  ? '// already liked ♥'
                  : '// click → send appreciation'}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BottomRightHUD;
