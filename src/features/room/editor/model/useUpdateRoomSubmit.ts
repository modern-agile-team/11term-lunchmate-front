import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { roomQueryKeys } from '@/entities/room';
import { updateRoom } from '../api';
import { getRoomSubmitErrorMessage } from './roomEditor.messages';
import type { RoomEditorModalProps } from './roomEditor.types';

type UseUpdateRoomSubmitParams = Pick<
  RoomEditorModalProps,
  'onSuccess' | 'onError' | 'onRequireLogin'
>;

interface UseUpdateRoomSubmitCallbacks {
  setSubmitMessage: (message: string) => void;
  setSubmitMessageTone: (tone: 'error' | 'success') => void;
}

export const useUpdateRoomSubmit = ({
  onSuccess,
  onError,
  onRequireLogin,
}: UseUpdateRoomSubmitParams) => {
  const queryClient = useQueryClient();

  const updateRoomMutation = useMutation({
    mutationFn: ({
      targetRoomId,
      payload,
    }: {
      targetRoomId: number;
      payload: Parameters<typeof updateRoom>[1];
    }) => updateRoom(targetRoomId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(variables.targetRoomId) }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.members(variables.targetRoomId) }),
      ]);
      onSuccess?.();
    },
  });

  const submitUpdateRoom = async (
    targetRoomId: number,
    payload: Parameters<typeof updateRoom>[1],
    { setSubmitMessage, setSubmitMessageTone }: UseUpdateRoomSubmitCallbacks,
  ) => {
    try {
      await updateRoomMutation.mutateAsync({
        targetRoomId,
        payload,
      });
      return;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        onRequireLogin?.();
      }

      const message = getRoomSubmitErrorMessage(error, 'edit');
      setSubmitMessage(message);
      setSubmitMessageTone('error');
      onError?.(message);
    }
  };

  return {
    updateRoomMutation,
    isPending: updateRoomMutation.isPending,
    submitUpdateRoom,
  };
};
