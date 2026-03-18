import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
  profileImage: string;
  name: string;
  size?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profileImage,
  name,
  size = 140,
}) => {
  const clicks = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const handleClick = useCallback(() => {
    clicks.current += 1;

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => { clicks.current = 0; }, 800);

    if (clicks.current >= 5) {
      clicks.current = 0;
      setSpinning(true);
      setShowMsg(true);
      setTimeout(() => setSpinning(false), 700);
      setTimeout(() => setShowMsg(false), 2200);
    }
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          padding: 3,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          boxShadow: '0 0 40px rgba(var(--color-primary-rgb, 127, 176, 105), 0.25), 0 0 80px rgba(var(--color-primary-rgb, 127, 176, 105), 0.1)',
          cursor: 'pointer',
          animation: spinning ? 'avatarSpin 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97)' : undefined,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--color-bg-glass, #111)',
          }}
        >
          <Image
            src={profileImage}
            alt={`${name} — Full Stack Engineer`}
            width={size}
            height={size}
            priority
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>

      {showMsg && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-bg-glass)',
            border: '1px solid var(--color-primary)',
            borderRadius: 8,
            padding: '6px 14px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: 'var(--color-primary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'avatarMsgIn 0.2s ease',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
          }}
        >
          hey! 👋
        </div>
      )}

      <style>{`
        @keyframes avatarSpin {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(180deg) scale(1.12); }
          75%  { transform: rotate(540deg) scale(1.12); }
          100% { transform: rotate(720deg) scale(1); }
        }
        @keyframes avatarMsgIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileAvatar;
