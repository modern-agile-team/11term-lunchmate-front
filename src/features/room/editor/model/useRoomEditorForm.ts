import { useForm } from '@tanstack/react-form';
import {
  INITIAL_ROOM_EDITOR_FORM_VALUES,
  type RoomEditorModalProps,
} from './roomEditor.types';
import { useRoomEditorReset } from './useRoomEditorReset';
import { useRoomEditorSubmit } from './useRoomEditorSubmit';

export const useRoomEditorForm = (props: RoomEditorModalProps) => {
  const submit = useRoomEditorSubmit(props);
  const roomEditorForm = useForm({
    defaultValues: INITIAL_ROOM_EDITOR_FORM_VALUES,
    onSubmit: async ({ value }) => {
      await submit.submitRoom(value);
    },
  });
  const reset = useRoomEditorReset({
    roomEditorForm,
    isOpen: props.isOpen,
    initialValues: props.initialValues,
    onClose: props.onClose,
    createRoomMutation: submit.createRoomMutation,
    updateRoomMutation: submit.updateRoomMutation,
    setSubmitMessage: submit.setSubmitMessage,
    setSubmitMessageTone: submit.setSubmitMessageTone,
  });

  return {
    roomEditorForm,
    submitMessage: submit.submitMessage,
    submitMessageTone: submit.submitMessageTone,
    isPending: submit.isPending,
    isEditMode: submit.isEditMode,
    setSubmitMessage: submit.setSubmitMessage,
    handleSubmit: () => roomEditorForm.handleSubmit(),
    reset,
  };
};
