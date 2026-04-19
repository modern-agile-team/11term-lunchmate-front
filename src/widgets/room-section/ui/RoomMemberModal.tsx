interface RoomMember {
  userId: number;
  nickname: string;
}

interface RoomMembersQueryState {
  isLoading: boolean;
  isError: boolean;
}

interface RoomMemberModalProps {
  roomMembersQuery: RoomMembersQueryState;
  roomMembers: RoomMember[];
  isHostUser: boolean;
  currentUserId: number | null;
  onKickMember: (userId: number) => void;
}

const RoomMemberModal = ({
  roomMembersQuery,
  roomMembers,
  isHostUser,
  currentUserId,
  onKickMember,
}: RoomMemberModalProps) => (
  <section className="mt-6 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-slate-800">참여 멤버</h4>
      <span className="text-xs text-slate-400">{roomMembers.length}명</span>
    </div>
    {roomMembersQuery.isLoading ? (
      <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
        멤버 목록을 불러오는 중...
      </div>
    ) : null}
    {roomMembersQuery.isError ? (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-600">
        멤버 목록을 불러오지 못했어요.
      </div>
    ) : null}
    {!roomMembersQuery.isLoading && !roomMembersQuery.isError
      ? roomMembers.map((member) => (
          <div
            key={member.userId}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">{member.nickname}</span>
            {isHostUser && currentUserId !== member.userId ? (
              <button
                type="button"
                onClick={() => {
                  void onKickMember(member.userId);
                }}
                className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                강퇴
              </button>
            ) : null}
          </div>
        ))
      : null}
  </section>
);

export default RoomMemberModal;
