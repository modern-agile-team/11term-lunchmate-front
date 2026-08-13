import { useState } from 'react';

interface RoomMemberAvatarProps {
  nickname: string;
  profileImageUrl: string | null;
}

const RoomMemberAvatar = ({ nickname, profileImageUrl }: RoomMemberAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(profileImageUrl) && !imageError;

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
      {showImage ? (
        <img
          src={profileImageUrl ?? undefined}
          alt={`${nickname} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-lg font-semibold text-slate-500">{nickname.charAt(0)}</span>
      )}
    </div>
  );
};

export default RoomMemberAvatar;
