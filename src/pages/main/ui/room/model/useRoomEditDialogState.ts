import { useState } from 'react';

interface UseRoomEditDialogStateParams {
  selectedRoomId: number | null;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
}

export const useRoomEditDialogState = ({
  selectedRoomId,
  invalidateRoomCaches,
}: UseRoomEditDialogStateParams) => {
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);

  const handleEditRoomSuccess = async () => {
    if (selectedRoomId === null) return;
    setIsEditRoomModalOpen(false);
    await invalidateRoomCaches(selectedRoomId);
  };

  return {
    isEditRoomModalOpen,
    setIsEditRoomModalOpen,
    handleEditRoomSuccess,
  };
};
