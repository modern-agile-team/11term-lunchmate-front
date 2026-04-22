interface ProfileEditorStatusProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}

const ProfileEditorStatus = ({
  isLoading,
  isError,
  error,
  onRetry,
}: ProfileEditorStatusProps) => {
  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-[32px] bg-white px-6 py-16 text-slate-500 shadow-sm sm:px-8 md:px-10">
        프로필을 불러오는 중...
      </section>
    );
  }

  if (!isError) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-4xl rounded-[32px] bg-white px-6 py-16 text-center shadow-sm sm:px-8 md:px-10">
      <p className="text-base text-rose-500">
        프로필을 불러오지 못했어요.
        {error instanceof Error ? ` ${error.message}` : ''}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 h-11 rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        다시 시도
      </button>
    </section>
  );
};

export default ProfileEditorStatus;
