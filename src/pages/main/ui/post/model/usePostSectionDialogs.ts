import { toPostEditorFormValues } from '@/features/post/edit';
import type { usePostDetailActions } from './usePostDetailActions';
import type { MainPostDetail } from './types';

interface UsePostSectionDialogsParams {
  selectedPostDetail: MainPostDetail | null;
  postDetailActions: ReturnType<typeof usePostDetailActions>;
}

export const usePostSectionDialogs = ({
  selectedPostDetail,
  postDetailActions,
}: UsePostSectionDialogsParams) => ({
  isEditPostModalOpen: postDetailActions.isEditPostModalOpen,
  setIsEditPostModalOpen: postDetailActions.setIsEditPostModalOpen,
  isDeleteConfirmModalOpen: postDetailActions.isDeleteConfirmModalOpen,
  setIsDeleteConfirmModalOpen: postDetailActions.setIsDeleteConfirmModalOpen,
  deleteErrorMessage: postDetailActions.deleteErrorMessage,
  handleDeletePost: postDetailActions.handleDeletePost,
  isDeletePostPending: postDetailActions.isDeletePostPending,
  editPostInitialValues: selectedPostDetail ? toPostEditorFormValues(selectedPostDetail) : undefined,
  handleEditPostSuccess: postDetailActions.handleEditPostSuccess,
});
