interface ProfileAvatarProps {
  nickname: string;
  profileImageUrl: string;
  imageError: boolean;
  onError: () => void;
  onClick?: () => void;
}

const ProfileAvatar = ({
  nickname,
  profileImageUrl,
  imageError,
  onError,
  onClick,
}: ProfileAvatarProps) => {
  const displayNickname = nickname.trim() || '익명 사용자';
  const showProfileImage = Boolean(profileImageUrl) && !imageError;
  const profileInitial = displayNickname.charAt(0).toUpperCase() || '익';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="프로필 이미지 URL 수정"
      className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-500 shadow-sm transition hover:scale-[1.02] hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:h-32 sm:w-32"
    >
      {showProfileImage ? (
        <img
          src={profileImageUrl}
          alt={`${displayNickname} profile`}
          className="h-full w-full object-cover"
          onError={onError}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white text-slate-600">
          <span className="text-3xl font-semibold sm:text-4xl">{profileInitial}</span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
            Profile
          </span>
        </div>
      )}
    </button>
  );
};

export default ProfileAvatar;
