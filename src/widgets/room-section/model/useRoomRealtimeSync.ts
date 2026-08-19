import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRoomCaches } from '@/entities/room';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';
import { getRoomSocket } from '@/shared/socket/roomSocketClient';

interface RoomEventPayload {
  roomId: number;
}

interface UseRoomRealtimeSyncParams {
  roomIds: number[];
  onRoomDeleted: (roomId: number) => void;
}

export const useRoomRealtimeSync = ({ roomIds, onRoomDeleted }: UseRoomRealtimeSyncParams) => {
  const queryClient = useQueryClient();
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);
  const joinedRoomIdsRef = useRef<Set<number>>(new Set());
  const roomIdsKey = [...new Set(roomIds)].sort((a, b) => a - b).join(',');
  const roomIdsKeyRef = useRef(roomIdsKey);

  useEffect(() => {
    roomIdsKeyRef.current = roomIdsKey;

    if (!isAuthed) {
      return;
    }

    const socket = getRoomSocket();
    const nextRoomIds = new Set(roomIdsKey === '' ? [] : roomIdsKey.split(',').map(Number));

    nextRoomIds.forEach((roomId) => {
      if (!joinedRoomIdsRef.current.has(roomId)) {
        socket.emit('room.join', { roomId });
      }
    });

    joinedRoomIdsRef.current.forEach((roomId) => {
      if (!nextRoomIds.has(roomId)) {
        socket.emit('room.leave', { roomId });
      }
    });

    joinedRoomIdsRef.current = nextRoomIds;
  }, [isAuthed, roomIdsKey]);

  useEffect(
    () => () => {
      const socket = getRoomSocket();
      joinedRoomIdsRef.current.forEach((roomId) => socket.emit('room.leave', { roomId }));
      joinedRoomIdsRef.current = new Set();
    },
    [],
  );

  useEffect(() => {
    const socket = getRoomSocket();

    const handleConnect = () => {
      const currentRoomIds = roomIdsKeyRef.current;
      const roomIdsToJoin = new Set(
        currentRoomIds === '' ? [] : currentRoomIds.split(',').map(Number),
      );

      roomIdsToJoin.forEach((roomId) => socket.emit('room.join', { roomId }));
      joinedRoomIdsRef.current = roomIdsToJoin;
    };
    const handleMembersUpdated = ({ roomId }: RoomEventPayload) => {
      void invalidateRoomCaches(queryClient, roomId);
    };
    const handleRoomDeleted = ({ roomId }: RoomEventPayload) => {
      void invalidateRoomCaches(queryClient, roomId);
      onRoomDeleted(roomId);
    };

    socket.on('connect', handleConnect);
    socket.on('room.members_updated', handleMembersUpdated);
    socket.on('room.deleted', handleRoomDeleted);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('room.members_updated', handleMembersUpdated);
      socket.off('room.deleted', handleRoomDeleted);
    };
  }, [queryClient, onRoomDeleted]);
};
