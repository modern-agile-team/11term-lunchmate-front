import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { roomQueryKeys, type CreateRoomRequest, type UpdateRoomRequest } from '@/entities/room';
import { createRoom } from '@/features/room/create/api';
import { updateRoom } from '@/features/room/edit/api';
import { getRoomSubmitErrorMessage } from './roomEditor.messages';
import { INITIAL_ROOM_EDITOR_FORM_VALUES, type RoomEditorModalProps } from './roomEditor.types';
import { validateRoomEditorValues } from './roomEditor.validators';

export const useRoomEditorForm = ({
  isOpen,
  onClose,
  mode = 'create',
  roomId,
  initialValues,
  onSuccess,
  onError,
  onRequireLogin,
}: RoomEditorModalProps) => {
  const queryClient = useQueryClient();
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageTone, setSubmitMessageTone] = useState<'error' | 'success'>('success');
  const isEditMode = mode === 'edit';

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.details() }),
      ]);

      onSuccess?.();
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        onRequireLogin?.();
      }

      const message = getRoomSubmitErrorMessage(error, 'create');
      setSubmitMessage(message);
      setSubmitMessageTone('error');
      onError?.(message);
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ targetRoomId, payload }: { targetRoomId: number; payload: Parameters<typeof updateRoom>[1] }) =>
      updateRoom(targetRoomId, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(variables.targetRoomId) }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.members(variables.targetRoomId) }),
      ]);

      onSuccess?.();
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        onRequireLogin?.();
      }

      const message = getRoomSubmitErrorMessage(error, 'edit');
      setSubmitMessage(message);
      setSubmitMessageTone('error');
      onError?.(message);
    },
  });

  const roomEditorForm = useForm({
    defaultValues: INITIAL_ROOM_EDITOR_FORM_VALUES,
    onSubmit: async ({ value }) => {
      const validationResult = validateRoomEditorValues(value);

      if (validationResult.error) {
        setSubmitMessage(validationResult.error);
        setSubmitMessageTone('error');
        return;
      }

      setSubmitMessage('');
      if (!validationResult.parsed) {
        return;
      }

      const parsedValues = validationResult.parsed;
      const payload: CreateRoomRequest & UpdateRoomRequest = {
        title: parsedValues.title,
        description: parsedValues.description || undefined,
        roomType: parsedValues.roomType,
        maxMembersCount: parsedValues.maxMembersCount,
        place: parsedValues.place,
        lunchAt: parsedValues.lunchAt,
        minAge: parsedValues.minAge,
        maxAge: parsedValues.maxAge,
      };

      if (isEditMode) {
        if (!roomId) {
          setSubmitMessage('수정할 방 정보를 찾을 수 없어요.');
          setSubmitMessageTone('error');
          onError?.('수정할 방 정보를 찾을 수 없어요.');
          return;
        }

        await updateRoomMutation.mutateAsync({
          targetRoomId: roomId,
          payload,
        });

        return;
      }

      await createRoomMutation.mutateAsync(payload);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    roomEditorForm.reset(initialValues ?? INITIAL_ROOM_EDITOR_FORM_VALUES);
  }, [initialValues, isOpen, roomEditorForm]);

  const reset = () => {
    roomEditorForm.reset(initialValues ?? INITIAL_ROOM_EDITOR_FORM_VALUES);
    createRoomMutation.reset();
    updateRoomMutation.reset();
    setSubmitMessage('');
    setSubmitMessageTone('success');
    onClose();
  };

  return {
    roomEditorForm,
    submitMessage,
    submitMessageTone,
    isPending: createRoomMutation.isPending || updateRoomMutation.isPending,
    isEditMode,
    setSubmitMessage,
    handleSubmit: () => roomEditorForm.handleSubmit(),
    reset,
  };
};
