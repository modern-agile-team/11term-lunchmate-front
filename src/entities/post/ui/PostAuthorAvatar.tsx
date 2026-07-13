import { useState } from 'react';

interface PostAuthorAvatarProps {
  nickname: string;
  profileImageUrl: string;
  size?: 'sm' | 'md';
}

const sizeClassMap = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-9 w-9 text-xs',
};

const PostAuthorAvatar = ({ nickname, profileImageUrl, size = 'sm' }: PostAuthorAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const displayNickname = nickname.trim() || '익명 사용자';
  const showImage = Boolean(profileImageUrl) && !imageError;
  const initial = displayNickname.charAt(0).toUpperCase() || '익';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-semibold text-slate-600 ${sizeClassMap[size]}`}
    >
      {showImage ? (
        <img
          src={profileImageUrl}
          alt={`${displayNickname} 프로필`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
};

export default PostAuthorAvatar;
