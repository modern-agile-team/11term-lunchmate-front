interface ProfileSaveButtonProps {
  isPending: boolean;
  saveMessage: string;
  saveMessageTone: 'success' | 'error';
  onSave: () => void;
}

const ProfileSaveButton = ({
  isPending,
  saveMessage,
  saveMessageTone,
  onSave,
}: ProfileSaveButtonProps) => (
  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
    <button
      type="button"
      onClick={onSave}
      disabled={isPending}
      className="h-14 rounded-2xl bg-slate-900 px-6 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {isPending ? '저장 중...' : '저장'}
    </button>
    {saveMessage ? (
      <p className={`text-sm ${saveMessageTone === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
        {saveMessage}
      </p>
    ) : null}
  </div>
);

export default ProfileSaveButton;
