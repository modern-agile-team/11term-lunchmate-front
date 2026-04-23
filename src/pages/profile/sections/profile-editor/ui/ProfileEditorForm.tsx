import { MBTI_OPTIONS, type UserProfile } from '@/entities/user';
import { ProfileSaveButton } from '@/features/profile/update';

interface ProfileEditorFormProps {
  profile: UserProfile;
  saveMessage: string;
  saveMessageTone: 'success' | 'error';
  isSavePending: boolean;
  onFieldChange: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void;
  onSave: () => void;
}

const ProfileEditorForm = ({
  profile,
  saveMessage,
  saveMessageTone,
  isSavePending,
  onFieldChange,
  onSave,
}: ProfileEditorFormProps) => (
  <div className="mt-10 space-y-7">
    <label className="block">
      <span className="mb-3 block text-[18px] font-medium text-slate-800">닉네임</span>
      <input
        type="text"
        value={profile.nickname}
        onChange={(event) => onFieldChange('nickname', event.target.value)}
        placeholder="닉네임을 입력하세요"
        className="h-16 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
      />
    </label>
    <label className="block">
      <span className="mb-3 block text-[18px] font-medium text-slate-800">이름</span>
      <input
        type="text"
        value={profile.name}
        onChange={(event) => onFieldChange('name', event.target.value)}
        placeholder="이름을 입력하세요"
        className="h-16 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
      />
    </label>
    <label className="block">
      <span className="mb-3 block text-[18px] font-medium text-slate-800">한줄소개</span>
      <textarea
        value={profile.introduce}
        onChange={(event) => onFieldChange('introduce', event.target.value)}
        placeholder="소개를 입력하세요"
        rows={4}
        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-5 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
      />
    </label>
    <div className="block">
      <span className="mb-3 block text-[18px] font-medium text-slate-800">MBTI</span>
      <div className="grid grid-cols-5 gap-3">
        {MBTI_OPTIONS.map((mbti) => {
          const isSelected = profile.mbti === mbti;
          return (
            <button
              key={mbti}
              type="button"
              onClick={() => onFieldChange('mbti', mbti)}
              aria-pressed={isSelected}
              className={`h-12 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
            >
              {mbti}
            </button>
          );
        })}
      </div>
    </div>
    <ProfileSaveButton
      isPending={isSavePending}
      saveMessage={saveMessage}
      saveMessageTone={saveMessageTone}
      onSave={onSave}
    />
  </div>
);

export default ProfileEditorForm;
