import type { RoomConfirmTarget } from './useRoomActionFeedback';

interface DeriveRoomConfirmDialogConfigParams {
  confirmTarget: RoomConfirmTarget;
  isLeavePending: boolean;
  isDeletePending: boolean;
  isCompletePending: boolean;
  isKickPending: boolean;
  onConfirmLeave: () => void;
  onConfirmDelete: () => void;
  onConfirmComplete: () => void;
  onConfirmKick: (userId: number) => void;
}

export interface RoomConfirmDialogConfig {
  tone: 'danger' | 'default';
  eyebrow: string;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onConfirm: () => void;
}

export const deriveRoomConfirmDialogConfig = ({
  confirmTarget,
  isLeavePending,
  isDeletePending,
  isCompletePending,
  isKickPending,
  onConfirmLeave,
  onConfirmDelete,
  onConfirmComplete,
  onConfirmKick,
}: DeriveRoomConfirmDialogConfigParams): RoomConfirmDialogConfig | null => {
  if (!confirmTarget) {
    return null;
  }

  switch (confirmTarget.type) {
    case 'leave':
      return {
        tone: 'danger',
        eyebrow: '방 나가기',
        title: '이 방에서 나갈까요?',
        description: '나가면 다시 참여해야 방 정보를 볼 수 있어요.',
        confirmLabel: '나가기',
        pendingLabel: '나가는 중...',
        isPending: isLeavePending,
        onConfirm: onConfirmLeave,
      };
    case 'delete':
      return {
        tone: 'danger',
        eyebrow: '방 삭제',
        title: '이 방을 삭제할까요?',
        description: '삭제 후 되돌릴 수 없어요.',
        confirmLabel: '삭제',
        pendingLabel: '삭제 중...',
        isPending: isDeletePending,
        onConfirm: onConfirmDelete,
      };
    case 'complete':
      return {
        tone: 'default',
        eyebrow: '방 완료 처리',
        title: '이 방을 완료 처리할까요?',
        description: '완료 처리하면 더 이상 새로운 참여를 받을 수 없어요.',
        confirmLabel: '완료 처리',
        pendingLabel: '처리 중...',
        isPending: isCompletePending,
        onConfirm: onConfirmComplete,
      };
    case 'kick':
      return {
        tone: 'danger',
        eyebrow: '멤버 강퇴',
        title: `${confirmTarget.nickname}님을 강퇴할까요?`,
        description: '강퇴된 멤버는 다시 참여해야 방에 들어올 수 있어요.',
        confirmLabel: '강퇴',
        pendingLabel: '강퇴 중...',
        isPending: isKickPending,
        onConfirm: () => onConfirmKick(confirmTarget.userId),
      };
    default:
      return null;
  }
};
