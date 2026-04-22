import { usePostDetailController } from './usePostDetailController';
import { usePostDetailDialogState } from './usePostDetailDialogState';
import type { usePostSectionData } from './usePostSectionData';

interface UsePostSectionControllersParams {
  postSelection: ReturnType<typeof usePostSectionData>['postSelection'];
  postItems: ReturnType<typeof usePostSectionData>['infinitePosts']['postItems'];
  onRequireLogin: () => void;
}

export const usePostSectionControllers = ({
  postSelection,
  postItems,
  onRequireLogin,
}: UsePostSectionControllersParams) => {
  const dialogState = usePostDetailDialogState();
  const postDetailActions = usePostDetailController({
    selectedPostDetail: postSelection.selectedPostDetail,
    postDetailQuery: postSelection.postDetailQuery,
    postItems,
    onRequireLogin,
    setSelectedPostId: postSelection.setSelectedPostId,
    closeDeleteConfirm: () => dialogState.setIsDeleteConfirmModalOpen(false),
    closeEditModal: () => dialogState.setIsEditPostModalOpen(false),
  });
  return {
    dialogState,
    postDetailActions,
  };
};
