interface EmptyRoomStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  roomCount: number;
}

const EmptyRoomState = ({
  isLoading,
  isError,
  error,
  roomCount,
}: EmptyRoomStateProps) => {
  if (isLoading) {
    return (
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        점심 방을 불러오는 중...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        점심 방을 불러오지 못했어요.
        {error instanceof Error ? ` ${error.message}` : ''}
      </section>
    );
  }

  if (roomCount === 0) {
    return (
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        아직 열려 있는 점심 방이 없어요.
      </section>
    );
  }

  return null;
};

export default EmptyRoomState;
