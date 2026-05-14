import type {
  RoomMember,
  RoomMembersQueryState,
} from './RoomDetailPanel.types';

interface RoomMemberSectionProps {
  roomMembersQuery: RoomMembersQueryState;
  roomMembers: RoomMember[];
  isHostUser: boolean;
  currentUserId: number | null;
  onKickMember: (userId: number) => Promise<void>;
}

const RoomMemberSection = ({
  roomMembersQuery,
  roomMembers,
  isHostUser,
  currentUserId,
  onKickMember,
}: RoomMemberSectionProps) => (
  <section className="mt-6 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-slate-800">참여 멤버</h4>
      <span className="text-xs text-slate-400">{roomMembers.length}명</span>
    </div>
    {roomMembersQuery.isLoading ? (
      <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">멤버 목록을 불러오는 중...</div>
    ) : null}
    {roomMembersQuery.isError ? (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-600">멤버 목록을 불러오지 못했어요.</div>
    ) : null}
    {!roomMembersQuery.isLoading && !roomMembersQuery.isError
      ? roomMembers.map((member) => (
          <div
            key={member.userId}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                {member.profileImageUrl ? (
                  <img
                    src={member.profileImageUrl}
                    alt={`${member.nickname} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-500">
                    {member.nickname.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{member.nickname}</span>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                    {member.mbti}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {member.age}세
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">{member.schoolName}</p>
              </div>
            </div>
            {isHostUser && currentUserId !== member.userId ? (
              <button
                type="button"
                onClick={() => void onKickMember(member.userId)}
                className="shrink-0 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                강퇴
              </button>
            ) : null}
          </div>
        ))
      : null}
  </section>
);

export default RoomMemberSection;
