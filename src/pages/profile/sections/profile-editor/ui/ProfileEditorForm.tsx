import { MBTI_OPTIONS, type Gender, type MbtiType, type User } from '@/entities/user';
import { EditableField, useUpdateProfileField } from '@/features/profile/update';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

interface ProfileEditorFormProps {
  user: User;
}

const ProfileEditorForm = ({ user }: ProfileEditorFormProps) => {
  const updateField = useUpdateProfileField();

  return (
    <div>
      <EditableField
        label="닉네임"
        value={user.nickname}
        displayValue={
          <p className="text-sm text-slate-700 sm:text-base">
            {user.nickname || '닉네임이 아직 없어요.'}
          </p>
        }
        renderEditor={(value, onChange) => (
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="닉네임을 입력하세요"
            className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white sm:text-base"
          />
        )}
        validate={(value) => (value.trim().length > 0 ? null : '닉네임을 입력해 주세요.')}
        onSave={async (value) => {
          await updateField.mutateAsync({ nickname: value.trim() });
        }}
      />

      <EditableField
        label="생년월일"
        value={user.birthDate}
        displayValue={
          <p className="text-sm text-slate-700 sm:text-base">{user.birthDate || '미입력'}</p>
        }
        renderEditor={(value, onChange) => (
          <input
            type="date"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-200 focus:bg-white sm:text-base"
          />
        )}
        validate={(value) => (value ? null : '생년월일을 입력해 주세요.')}
        onSave={async (value) => {
          await updateField.mutateAsync({ birthDate: value });
        }}
      />

      <EditableField
        label="학교 정보"
        value={user.schoolInfo ?? ''}
        displayValue={
          <p className="text-sm text-slate-700 sm:text-base">
            {user.schoolInfo || '학교 정보가 아직 없어요.'}
          </p>
        }
        renderEditor={(value, onChange) => (
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="학교 정보를 입력하세요"
            className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white sm:text-base"
          />
        )}
        onSave={async (value) => {
          await updateField.mutateAsync({ schoolInfo: value.trim() });
        }}
      />

      <EditableField
        label="성별"
        value={user.gender}
        displayValue={
          <p className="text-sm text-slate-700 sm:text-base">
            {GENDER_OPTIONS.find((option) => option.value === user.gender)?.label ?? '미설정'}
          </p>
        }
        renderEditor={(value, onChange) => (
          <div className="flex gap-2 sm:gap-3">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-pressed={isSelected}
                  className={`h-11 flex-1 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
        onSave={async (value) => {
          await updateField.mutateAsync({ gender: value });
        }}
      />

      <EditableField
        label="한줄소개"
        align="start"
        value={user.introduce ?? ''}
        displayValue={
          <p className="whitespace-pre-wrap text-sm text-slate-700 sm:text-base">
            {user.introduce || '아직 한 줄 소개가 없어요.'}
          </p>
        }
        renderEditor={(value, onChange) => (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="소개를 입력하세요"
            rows={3}
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white sm:text-base"
          />
        )}
        onSave={async (value) => {
          await updateField.mutateAsync({ introduce: value.trim() });
        }}
      />

      <EditableField
        label="MBTI"
        align="start"
        withBorder={false}
        value={user.mbti ?? ('' as MbtiType | '')}
        displayValue={
          <p className="text-sm text-slate-700 sm:text-base">{user.mbti || '미설정'}</p>
        }
        renderEditor={(value, onChange) => (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
            {MBTI_OPTIONS.map((mbti) => {
              const isSelected = value === mbti;
              return (
                <button
                  key={mbti}
                  type="button"
                  onClick={() => onChange(mbti)}
                  aria-pressed={isSelected}
                  className={`h-11 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
                >
                  {mbti}
                </button>
              );
            })}
          </div>
        )}
        onSave={async (value) => {
          await updateField.mutateAsync({ mbti: value || undefined });
        }}
      />
    </div>
  );
};

export default ProfileEditorForm;
