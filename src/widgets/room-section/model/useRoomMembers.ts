import { useQuery } from '@tanstack/react-query';
import { roomMembersQueryOptions, type RoomDetailResponse } from '@/entities/room';
import { myUserQueryOptions } from '@/entities/user';
import { isAuthenticated } from '@/shared/lib/auth/session';

interface UseRoomMembersParams {
  selectedRoomId: number | null;
  selectedRoomDetail: RoomDetailResponse | null;
}

export const useRoomMembers = ({
  selectedRoomId,
  selectedRoomDetail,
}: UseRoomMembersParams) => {
  const isLoggedIn = isAuthenticated();

  const currentUserQuery = useQuery({
    ...myUserQueryOptions(),
    enabled: isLoggedIn,
  });

  const roomMembersQuery = useQuery({
    ...roomMembersQueryOptions(selectedRoomId ?? 0),
    enabled: selectedRoomId !== null && selectedRoomDetail !== null,
  });

  const roomMembers = roomMembersQuery.data?.items ?? [];
  const currentUserId = currentUserQuery.data?.id ?? null;
  const isHostUser =
    selectedRoomDetail !== null && currentUserId === selectedRoomDetail.hostUserId;

  return {
    roomMembersQuery,
    roomMembers,
    currentUserId,
    isHostUser,
  };
};
