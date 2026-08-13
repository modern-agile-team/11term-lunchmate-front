import { useState } from 'react';

type MessageTone = 'success' | 'error';

export type RoomConfirmTarget =
  | { type: 'leave' }
  | { type: 'delete' }
  | { type: 'complete' }
  | { type: 'kick'; userId: number; nickname: string }
  | null;

export const useRoomActionFeedback = () => {
  const [actionMessage, setActionMessage] = useState('');
  const [actionTone, setActionTone] = useState<MessageTone>('success');
  const [confirmTarget, setConfirmTarget] = useState<RoomConfirmTarget>(null);

  const resetActionState = () => {
    setActionMessage('');
    setActionTone('success');
  };

  return {
    actionMessage,
    setActionMessage,
    actionTone,
    setActionTone,
    confirmTarget,
    setConfirmTarget,
    closeConfirmTarget: () => setConfirmTarget(null),
    resetActionState,
  };
};
