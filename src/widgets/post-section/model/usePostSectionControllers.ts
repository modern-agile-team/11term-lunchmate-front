import { usePostDetailController } from './usePostDetailController';
import { usePostDetailDialogState } from './usePostDetailDialogState';
import type { usePostSectionData } from './usePostSectionData';

interface UsePostSectionControllersParams {
  postSelection: ReturnType<typeof usePostSectionData>['postSelection'];
  onRequireLogin: () => void;
}

export const usePostSectionControllers = ({
  postSelection,
  onRequireLogin,
}: UsePostSectionControllersParams) => {
  const dialogState = usePostDetailDialogState();
  const postDetailActions = usePostDetailController({
    selectedPostDetail: postSelection.selectedPostDetail,
    postDetailQuery: postSelection.postDetailQuery,
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
