interface UsePostSectionActionsParams {
  handleSelectPost: (postId: number) => void;
  resetCommentTransientState: () => void;
}

export const usePostSectionActions = ({
  handleSelectPost,
  resetCommentTransientState,
}: UsePostSectionActionsParams) => {
  const onPostSelect = (postId: number) => {
    handleSelectPost(postId);
    resetCommentTransientState();
  };

  return {
    onPostSelect,
  };
};
