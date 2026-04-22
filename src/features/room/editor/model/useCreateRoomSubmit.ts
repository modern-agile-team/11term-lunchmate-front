import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { roomQueryKeys } from '@/entities/room';
import { createRoom } from '../create.api';
import { getRoomSubmitErrorMessage } from './roomEditor.messages';
import type { RoomEditorModalProps } from './roomEditor.types';

type UseCreateRoomSubmitParams = Pick<
  RoomEditorModalProps,
  'onSuccess' | 'onError' | 'onRequireLogin'
>;

interface UseCreateRoomSubmitCallbacks {
  setSubmitMessage: (message: string) => void;
  setSubmitMessageTone: (tone: 'error' | 'success') => void;
}

export const useCreateRoomSubmit = ({
  onSuccess,
  onError,
  onRequireLogin,
}: UseCreateRoomSubmitParams) => {
  const queryClient = useQueryClient();

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.details() }),
      ]);
      onSuccess?.();
    },
  });

  const submitCreateRoom = async (
    payload: Parameters<typeof createRoom>[0],
    { setSubmitMessage, setSubmitMessageTone }: UseCreateRoomSubmitCallbacks,
  ) => {
    try {
      await createRoomMutation.mutateAsync(payload);
      return;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        onRequireLogin?.();
      }

      const message = getRoomSubmitErrorMessage(error, 'create');
      setSubmitMessage(message);
      setSubmitMessageTone('error');
      onError?.(message);
    }
  };

  return {
    createRoomMutation,
    isPending: createRoomMutation.isPending,
    submitCreateRoom,
  };
};
