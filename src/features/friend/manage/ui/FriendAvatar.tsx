import { useState } from 'react';

interface FriendAvatarProps {
  nickname: string;
  profileImageUrl: string | null;
  size?: 'sm' | 'md';
}

const FriendAvatar = ({ nickname, profileImageUrl, size = 'md' }: FriendAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const displayNickname = nickname.trim() || '익명 사용자';
  const showImage = Boolean(profileImageUrl) && !imageError;
  const sizeClassName = size === 'sm' ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base';

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-semibold text-slate-500 ${sizeClassName}`}
    >
      {showImage ? (
        <img
          src={profileImageUrl ?? undefined}
          alt={`${displayNickname} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{displayNickname.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default FriendAvatar;
