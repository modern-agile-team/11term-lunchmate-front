import { useState } from 'react';

type MessageTone = 'success' | 'error';

export const useRoomActionFeedback = () => {
  const [actionMessage, setActionMessage] = useState('');
  const [actionTone, setActionTone] = useState<MessageTone>('success');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const resetActionState = () => {
    setActionMessage('');
    setActionTone('success');
  };

  return {
    actionMessage,
    setActionMessage,
    actionTone,
    setActionTone,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    resetActionState,
  };
};
