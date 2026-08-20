import AppDialog from '@/shared/ui/modal/AppDialog';
import PostCommentSection from '../comment/ui/PostCommentSection';
import PostDetailBody from './PostDetailBody';
import PostDetailError from './PostDetailError';
import PostDetailHeader from './PostDetailHeader';
import PostDetailLoading from './PostDetailLoading';
import PostReactionBar from './PostReactionBar';
import type { PostDetailPanelProps } from './PostDetailPanel.types';

const PostDetailPanel = ({ detail, reactions, actions, comments }: PostDetailPanelProps) => {
  const { selectedPostDetail, postDetailQuery, canEditSelectedPost } = detail;

  return (
    <AppDialog
      isOpen={selectedPostDetail !== null}
      onClose={actions.onClose}
      title={selectedPostDetail?.title ?? '게시글 상세'}
    >
      {selectedPostDetail ? (
        <>
          {postDetailQuery.isLoading ? <PostDetailLoading /> : null}

          {postDetailQuery.isError ? <PostDetailError error={postDetailQuery.error} /> : null}

          {!postDetailQuery.isLoading && !postDetailQuery.isError ? (
            <>
              <PostDetailHeader
                selectedPostDetail={selectedPostDetail}
                canEditSelectedPost={canEditSelectedPost}
                onEditOpen={actions.onEditOpen}
                onDeleteOpen={actions.onDeleteOpen}
              />
              <PostDetailBody selectedPostDetail={selectedPostDetail} />
              <PostReactionBar
                selectedPostDetail={selectedPostDetail}
                reactionErrorMessage={reactions.reactionErrorMessage}
                handlePostReaction={reactions.handlePostReaction}
                isLikePostPending={reactions.isLikePostPending}
              />
              <PostCommentSection comments={comments} />
            </>
          ) : null}
        </>
      ) : null}
    </AppDialog>
  );
};

export default PostDetailPanel;
