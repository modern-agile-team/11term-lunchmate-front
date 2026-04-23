import type { PostSyncRequest } from '@/entities/post';
import { usePostSection } from '../model/usePostSection';
import PostDetailPanel from './PostDetailPanel';
import PostFeed from './PostFeed';
import PostFilterBar from './PostFilterBar';
import PostSectionDialogs from './PostSectionDialogs';

interface PostSectionProps {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
  onRequireLogin: () => void;
}

const PostSection = ({ postSyncRequest, onPostSyncHandled, onRequireLogin }: PostSectionProps) => {
  const { filter, list, detail, comments, dialogs } = usePostSection({
    postSyncRequest,
    onPostSyncHandled,
    onRequireLogin,
  });

  return (
    <section className="space-y-4 md:space-y-5">
      <PostFilterBar {...filter} />
      <PostFeed {...list} />

      {!list.postsQuery.isLoading && !list.postsQuery.isError ? (
        <PostDetailPanel
          detail={{
            selectedPostDetail: detail.selectedPostDetail,
            postDetailQuery: detail.postDetailQuery,
            canEditSelectedPost: detail.canEditSelectedPost,
          }}
          reactions={{
            reactionErrorMessage: detail.reactionErrorMessage,
            handlePostReaction: detail.handlePostReaction,
            isLikePostPending: detail.isLikePostPending,
            isDislikePostPending: detail.isDislikePostPending,
          }}
          actions={{
            onEditOpen: () => dialogs.setIsEditPostModalOpen(true),
            onDeleteOpen: () => dialogs.setIsDeleteConfirmModalOpen(true),
          }}
          comments={comments}
        />
      ) : null}

      {detail.selectedPostDetail ? (
        <PostSectionDialogs
          selectedPostId={detail.selectedPostDetail.id}
          isEditPostModalOpen={dialogs.isEditPostModalOpen}
          setIsEditPostModalOpen={dialogs.setIsEditPostModalOpen}
          isDeleteConfirmModalOpen={dialogs.isDeleteConfirmModalOpen}
          setIsDeleteConfirmModalOpen={dialogs.setIsDeleteConfirmModalOpen}
          isDeletePostPending={dialogs.isDeletePostPending}
          deleteErrorMessage={dialogs.deleteErrorMessage}
          editPostInitialValues={dialogs.editPostInitialValues}
          onRequireLogin={onRequireLogin}
          handleEditPostSuccess={dialogs.handleEditPostSuccess}
          handleDeletePost={dialogs.handleDeletePost}
        />
      ) : null}
    </section>
  );
};

export default PostSection;
