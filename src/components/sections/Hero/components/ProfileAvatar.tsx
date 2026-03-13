import React from 'react';

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
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        padding: 3,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        boxShadow: '0 0 40px rgba(127, 176, 105, 0.25), 0 0 80px rgba(127, 176, 105, 0.1)',
      }}
    >
      <picture>
        <source srcSet={profileImage.replace(/\.\w+$/, '.webp')} type="image/webp" />
        <img
          src={profileImage}
          alt={`${name} — Full Stack Engineer`}
          width={size}
          height={size}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
            border: '3px solid var(--color-bg-glass, #111)',
          }}
        />
      </picture>
    </div>
  );
};

export default ProfileAvatar;
