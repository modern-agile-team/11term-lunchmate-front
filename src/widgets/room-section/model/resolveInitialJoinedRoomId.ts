interface ResolveInitialJoinedRoomIdParams {
  selectedRoomId: number | null;
  currentUserId: number | null;
  roomMembers: Array<{ id: number }>;
}

export const resolveInitialJoinedRoomId = ({
  selectedRoomId,
  currentUserId,
  roomMembers,
}: ResolveInitialJoinedRoomIdParams) => {
  if (selectedRoomId === null || currentUserId === null) {
    return null;
  }

  return roomMembers.some((member) => member.id === currentUserId) ? selectedRoomId : null;
};
