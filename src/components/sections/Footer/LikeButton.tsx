'use client';

import React, { useState, useEffect } from 'react';

const LS_KEY = 'portfolio:liked';

const LikeButton: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(LS_KEY) === '1');

    fetch('/api/likes')
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(0));
  }, []);

  const handleLike = async () => {
    if (liked || loading || count === null) return;
    setLoading(true);

    try {
      const res = await fetch('/api/likes', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setCount(data.count);
        setLiked(true);
        localStorage.setItem(LS_KEY, '1');
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      } else if (res.status === 409) {
        setLiked(true);
        localStorage.setItem(LS_KEY, '1');
        if (data.count !== undefined) setCount(data.count);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mono"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: liked ? 'var(--color-primary)' : 'var(--color-text-muted)',
        cursor: liked ? 'default' : loading ? 'wait' : 'pointer',
        transition: 'color 0.25s ease',
        userSelect: 'none',
        transform: pulse ? 'scale(1.08)' : 'scale(1)',
      }}
      onClick={handleLike}
      role="button"
      aria-label={liked ? 'You liked this portfolio' : 'Like this portfolio'}
      aria-pressed={liked}
    >
      <span
        style={{
          fontSize: '1rem',
          transition: 'transform 0.25s ease',
          display: 'inline-block',
          transform: pulse ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        {liked ? '♥' : '♡'}
      </span>
      <span>
        {count === null
          ? '$ send --appreciation'
          : liked
            ? `${count} liked this`
            : `${count} people liked this`}
      </span>
    </div>
  );
};

export default LikeButton;
