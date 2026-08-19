import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { myUserQueryOptions } from '@/entities/user';
import { calculateKoreanAge } from '@/shared/lib/date/calculateKoreanAge';
import type { RoomEditorFormValues, RoomEditorModalProps } from './roomEditor.types';
import { getRoomEditorPayload } from './roomEditorSubmit.mappers';
import { useCreateRoomSubmit } from './useCreateRoomSubmit';
import { useUpdateRoomSubmit } from './useUpdateRoomSubmit';

type UseRoomEditorSubmitParams = Pick<
  RoomEditorModalProps,
  'mode' | 'roomId' | 'onSuccess' | 'onError' | 'onRequireLogin'
>;

export const useRoomEditorSubmit = ({
  mode = 'create',
  roomId,
  onSuccess,
  onError,
  onRequireLogin,
}: UseRoomEditorSubmitParams) => {
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageTone, setSubmitMessageTone] = useState<'error' | 'success'>('success');
  const isEditMode = mode === 'edit';
  const myUserQuery = useQuery(myUserQueryOptions());
  const createSubmit = useCreateRoomSubmit({
    onSuccess,
    onError,
    onRequireLogin,
  });
  const updateSubmit = useUpdateRoomSubmit({
    onSuccess,
    onError,
    onRequireLogin,
  });

  const submitRoom = async (value: RoomEditorFormValues) => {
    const currentUser = myUserQuery.data;

    if (!currentUser) {
      const message = '내 프로필 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
      setSubmitMessage(message);
      setSubmitMessageTone('error');
      return;
    }

    const payloadResult = getRoomEditorPayload(value, {
      gender: currentUser.gender,
      age: calculateKoreanAge(currentUser.birthDate),
    });

    if (!('payload' in payloadResult)) {
      setSubmitMessage(payloadResult.error);
      setSubmitMessageTone('error');
      return;
    }

    setSubmitMessage('');

    if (isEditMode) {
      if (!roomId) {
        const message = '수정할 방 정보를 찾을 수 없어요.';
        setSubmitMessage(message);
        setSubmitMessageTone('error');
        onError?.(message);
        return;
      }

      await updateSubmit.submitUpdateRoom(roomId, payloadResult.payload, {
        setSubmitMessage,
        setSubmitMessageTone,
      });
      return;
    }

    await createSubmit.submitCreateRoom(payloadResult.payload, {
      setSubmitMessage,
      setSubmitMessageTone,
    });
  };

  return {
    createRoomMutation: createSubmit.createRoomMutation,
    updateRoomMutation: updateSubmit.updateRoomMutation,
    submitMessage,
    submitMessageTone,
    isPending: createSubmit.isPending || updateSubmit.isPending,
    isEditMode,
    setSubmitMessage,
    setSubmitMessageTone,
    submitRoom,
  };
};
