import type { PostSectionDialogsState } from './usePostSectionViewModel.types';

export const buildPostSectionDialogs = ({
  isEditPostModalOpen,
  setIsEditPostModalOpen,
  isDeleteConfirmModalOpen,
  setIsDeleteConfirmModalOpen,
  deleteErrorMessage,
  handleDeletePost,
  isDeletePostPending,
  editPostInitialValues,
  handleEditPostSuccess,
}: PostSectionDialogsState) => ({
  isEditPostModalOpen,
  setIsEditPostModalOpen,
  isDeleteConfirmModalOpen,
  setIsDeleteConfirmModalOpen,
  deleteErrorMessage,
  handleDeletePost,
  isDeletePostPending,
  editPostInitialValues,
  handleEditPostSuccess,
});
