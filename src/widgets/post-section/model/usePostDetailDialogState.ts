import { useState } from 'react';

export const usePostDetailDialogState = () => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  return {
    isEditPostModalOpen,
    setIsEditPostModalOpen,
    isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen,
  };
};
