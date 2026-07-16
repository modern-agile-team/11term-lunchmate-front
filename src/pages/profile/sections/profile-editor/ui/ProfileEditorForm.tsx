import { MBTI_OPTIONS, type Gender, type UserProfile } from '@/entities/user';
import { ProfileSaveButton } from '@/features/profile/update';
import InfoRow from '@/shared/ui/InfoRow';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

interface ProfileEditorFormProps {
  profile: UserProfile;
  isEditMode: boolean;
  saveMessage: string;
  saveMessageTone: 'success' | 'error';
  isSavePending: boolean;
  onFieldChange: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void;
  onSave: () => void;
}

const ProfileEditorForm = ({
  profile,
  isEditMode,
  saveMessage,
  saveMessageTone,
  isSavePending,
  onFieldChange,
  onSave,
}: ProfileEditorFormProps) => (
  <div>
    <InfoRow label="닉네임">
      {isEditMode ? (
        <input
          type="text"
          value={profile.nickname}
          onChange={(event) => onFieldChange('nickname', event.target.value)}
          placeholder="닉네임을 입력하세요"
          className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white sm:text-base"
        />
      ) : (
        <p className="text-sm text-slate-700 sm:text-base">
          {profile.nickname || '닉네임이 아직 없어요.'}
        </p>
      )}
    </InfoRow>

    <InfoRow label="성별">
      {isEditMode ? (
        <div className="flex gap-2 sm:gap-3">
          {GENDER_OPTIONS.map((option) => {
            const isSelected = profile.gender === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange('gender', option.value)}
                aria-pressed={isSelected}
                className={`h-11 flex-1 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-700 sm:text-base">
          {GENDER_OPTIONS.find((option) => option.value === profile.gender)?.label ?? '미설정'}
        </p>
      )}
    </InfoRow>

    <InfoRow label="한줄소개" align={isEditMode ? 'start' : 'center'}>
      {isEditMode ? (
        <textarea
          value={profile.introduce}
          onChange={(event) => onFieldChange('introduce', event.target.value)}
          placeholder="소개를 입력하세요"
          rows={3}
          className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white sm:text-base"
        />
      ) : (
        <p className="whitespace-pre-wrap text-sm text-slate-700 sm:text-base">
          {profile.introduce || '아직 한 줄 소개가 없어요.'}
        </p>
      )}
    </InfoRow>

    <InfoRow label="MBTI" align={isEditMode ? 'start' : 'center'} withBorder={isEditMode}>
      {isEditMode ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
          {MBTI_OPTIONS.map((mbti) => {
            const isSelected = profile.mbti === mbti;
            return (
              <button
                key={mbti}
                type="button"
                onClick={() => onFieldChange('mbti', mbti)}
                aria-pressed={isSelected}
                className={`h-11 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
              >
                {mbti}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-700 sm:text-base">{profile.mbti || '미설정'}</p>
      )}
    </InfoRow>

    {isEditMode ? (
      <div className="pt-5">
        <ProfileSaveButton
          isPending={isSavePending}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
          onSave={onSave}
        />
      </div>
    ) : null}
  </div>
);

export default ProfileEditorForm;
