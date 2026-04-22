interface UsePostSelectionActionParams {
  handleSelectPost: (postId: number) => void;
  resetCommentTransientState: () => void;
}

export const usePostSelectionAction = ({
  handleSelectPost,
  resetCommentTransientState,
}: UsePostSelectionActionParams) => ({
  handlePostSelect: (postId: number) => {
    handleSelectPost(postId);
    resetCommentTransientState();
  },
});
