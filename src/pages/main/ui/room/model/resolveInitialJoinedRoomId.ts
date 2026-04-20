interface ResolveInitialJoinedRoomIdParams {
  selectedRoomId: number | null;
  currentUserId: number | null;
  roomMembers: Array<{ userId: number }>;
}

export const resolveInitialJoinedRoomId = ({
  selectedRoomId,
  currentUserId,
  roomMembers,
}: ResolveInitialJoinedRoomIdParams) => {
  if (selectedRoomId === null || currentUserId === null) {
    return null;
  }

  return roomMembers.some((member) => member.userId === currentUserId)
    ? selectedRoomId
    : null;
};
