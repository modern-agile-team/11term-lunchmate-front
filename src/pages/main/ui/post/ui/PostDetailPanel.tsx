import PostCommentBridge from './PostCommentBridge';
import PostDetailBody from './PostDetailBody';
import PostDetailHeader from './PostDetailHeader';
import PostReactionBar from './PostReactionBar';
import type { PostDetailPanelProps } from './PostDetailPanel.types';

const PostDetailPanel = ({
  selectedPostDetail,
  postDetailQuery,
  canEditSelectedPost,
  reactionErrorMessage,
  handlePostReaction,
  isLikePostPending,
  isDislikePostPending,
  onEditOpen,
  onDeleteOpen,
  comments,
}: PostDetailPanelProps) => {
  if (!selectedPostDetail) {
    return null;
  }

  return (
    <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
      {postDetailQuery.isLoading ? (
        <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
          게시글 상세를 불러오는 중...
        </div>
      ) : null}

      {postDetailQuery.isError ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
          게시글 상세를 불러오지 못했어요.
          {postDetailQuery.error instanceof Error ? ` ${postDetailQuery.error.message}` : ''}
        </div>
      ) : null}

      {!postDetailQuery.isLoading && !postDetailQuery.isError ? (
        <>
          <PostDetailHeader
            selectedPostDetail={selectedPostDetail}
            canEditSelectedPost={canEditSelectedPost}
            onEditOpen={onEditOpen}
            onDeleteOpen={onDeleteOpen}
          />
          <PostDetailBody selectedPostDetail={selectedPostDetail} />
          <PostReactionBar
            selectedPostDetail={selectedPostDetail}
            reactionErrorMessage={reactionErrorMessage}
            handlePostReaction={handlePostReaction}
            isLikePostPending={isLikePostPending}
            isDislikePostPending={isDislikePostPending}
          />
          <PostCommentBridge comments={comments} />
        </>
      ) : null}
    </article>
  );
};

export default PostDetailPanel;
