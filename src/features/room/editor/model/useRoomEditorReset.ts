import { useEffect } from 'react';
import {
  INITIAL_ROOM_EDITOR_FORM_VALUES,
  type RoomEditorFormValues,
  type RoomEditorModalProps,
} from './roomEditor.types';

interface ResettableMutation {
  reset: () => void;
}

interface ResettableRoomEditorForm {
  reset: (values: RoomEditorFormValues) => void;
}

interface UseRoomEditorResetParams {
  roomEditorForm: ResettableRoomEditorForm;
  isOpen: boolean;
  initialValues?: RoomEditorFormValues;
  onClose: RoomEditorModalProps['onClose'];
  createRoomMutation: ResettableMutation;
  updateRoomMutation: ResettableMutation;
  setSubmitMessage: (message: string) => void;
  setSubmitMessageTone: (tone: 'error' | 'success') => void;
}

export const useRoomEditorReset = ({
  roomEditorForm,
  isOpen,
  initialValues,
  onClose,
  createRoomMutation,
  updateRoomMutation,
  setSubmitMessage,
  setSubmitMessageTone,
}: UseRoomEditorResetParams) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    roomEditorForm.reset(initialValues ?? INITIAL_ROOM_EDITOR_FORM_VALUES);
  }, [initialValues, isOpen, roomEditorForm]);

  return () => {
    roomEditorForm.reset(initialValues ?? INITIAL_ROOM_EDITOR_FORM_VALUES);
    createRoomMutation.reset();
    updateRoomMutation.reset();
    setSubmitMessage('');
    setSubmitMessageTone('success');
    onClose();
  };
};
