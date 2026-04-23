import PostCommentSection from '../comment/ui/PostCommentSection';
import PostDetailBody from './PostDetailBody';
import PostDetailError from './PostDetailError';
import PostDetailHeader from './PostDetailHeader';
import PostDetailLoading from './PostDetailLoading';
import PostReactionBar from './PostReactionBar';
import type { PostDetailPanelProps } from './PostDetailPanel.types';

const PostDetailPanel = ({
  detail,
  reactions,
  actions,
  comments,
}: PostDetailPanelProps) => {
  const { selectedPostDetail, postDetailQuery, canEditSelectedPost } = detail;

  if (!selectedPostDetail) {
    return null;
  }

  return (
    <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
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
            isDislikePostPending={reactions.isDislikePostPending}
          />
          <PostCommentSection comments={comments} />
        </>
      ) : null}
    </article>
  );
};

export default PostDetailPanel;
