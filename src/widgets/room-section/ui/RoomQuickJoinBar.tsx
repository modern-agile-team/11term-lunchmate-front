import { Sparkles } from 'lucide-react';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';

interface RoomQuickJoinBarProps {
  myRoomId: number | null;
  isQuickJoinPending: boolean;
  onQuickJoin: () => Promise<void>;
  onViewMyRoom: (roomId: number) => void;
}

const RoomQuickJoinBar = ({
  myRoomId,
  isQuickJoinPending,
  onQuickJoin,
  onViewMyRoom,
}: RoomQuickJoinBarProps) => {
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);

  return (
    <section className="flex items-center justify-between rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Sparkles className="h-4 w-4 text-amber-500" />
        {!isAuthed
          ? '로그인 후 빠른 참여를 이용할 수 있어요.'
          : myRoomId !== null
            ? '이미 참여중인 방이 있어요.'
            : '조건에 맞는 방에 바로 참여해보세요.'}
      </div>
      {myRoomId !== null ? (
        <button
          type="button"
          onClick={() => onViewMyRoom(myRoomId)}
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          내 방 보기
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void onQuickJoin()}
          disabled={isQuickJoinPending || !isAuthed}
          className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isQuickJoinPending ? '참여 중...' : '빠른 참여'}
        </button>
      )}
    </section>
  );
};

export default RoomQuickJoinBar;
