import { Heart, MessageSquareText, PencilLine, ThumbsDown, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import CreatePostModal, { type CreatePostFormValues } from '@/features/post-editor';
import DeletePostConfirmModal from '@/features/post-delete';
import CommentSection from '@/widgets/comment-section';
import {
  postCategoryFilterOptions,
  postCategoryStyleMap,
} from '../model/constants';
import { formatRelativeCreatedAt } from '../model/helpers';
import type { PostSyncRequest } from '../model/types';
import { usePostSection } from '../model/usePostSection';

interface PostSectionProps {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
  onRequireLogin: () => void;
}

const PostSection = ({ postSyncRequest, onPostSyncHandled, onRequireLogin }: PostSectionProps) => {
  const {
    loadMoreRef,
    selectedCategory,
    setSelectedCategory,
    postsQuery,
    postItems,
    selectedPostId,
    selectedPost,
    selectedPostDetail,
    postDetailQuery,
    canEditSelectedPost,
    commentsQuery,
    selectedPostComments,
    reactionErrorMessage,
    handleSelectPost,
    handlePostReaction,
    isLikePostPending,
    isDislikePostPending,
    commentInputValue,
    setCommentInputValue,
    handleCommentSubmit,
    isCommentSubmitPending,
    commentActionMessage,
    commentActionTone,
    editingCommentId,
    editingCommentValue,
    setEditingCommentValue,
    handleCommentUpdate,
    commentEditMessage,
    commentEditTone,
    deletingCommentId,
    handleCommentDelete,
    commentDeleteMessage,
    commentDeleteTone,
    handleCommentReaction,
    likingCommentId,
    dislikingCommentId,
    commentLikeMessage,
    commentLikeTone,
    commentDislikeMessage,
    commentDislikeTone,
    isEditPostModalOpen,
    setIsEditPostModalOpen,
    isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen,
    deleteErrorMessage,
    handleDeletePost,
    isDeletePostPending,
    editPostInitialValues,
    setEditingCommentId,
    setDeletingCommentId,
    setCommentDeleteMessage,
    setCommentEditMessage,
    setCommentEditTone,
    setCommentDeleteTone,
    handleEditPostSuccess,
  } = usePostSection({
    postSyncRequest,
    onPostSyncHandled,
    onRequireLogin,
  });

  return (
    <section className="space-y-4 md:space-y-5">
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
        <p className="text-sm font-semibold text-slate-700">카테고리</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {postCategoryFilterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedCategory(option.value)}
              className={cn(
                'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                selectedCategory === option.value
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {postsQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오는 중...
        </section>
      ) : null}

      {postsQuery.isError ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오지 못했어요.
          {postsQuery.error instanceof Error ? ` ${postsQuery.error.message}` : ''}
        </section>
      ) : null}

      {!postsQuery.isLoading && !postsQuery.isError && postItems.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          아직 등록된 게시글이 없어요.
        </section>
      ) : null}

      {!postsQuery.isLoading && !postsQuery.isError
        ? postItems.map((postItem) => (
            <article
              key={postItem.id}
              className={cn(
                'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
                selectedPostId === postItem.id
                  ? 'border-indigo-200 ring-4 ring-indigo-100/60'
                  : 'border-slate-200/80 hover:border-slate-300',
              )}
              onClick={() => handleSelectPost(postItem.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                    postCategoryStyleMap[postItem.category],
                  )}
                >
                  {postItem.category}
                </span>
                <span className="text-sm text-slate-400">
                  {formatRelativeCreatedAt(postItem.createdAt)}
                </span>
              </div>
              <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
                {postItem.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{postItem.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span className="font-medium text-slate-700">{postItem.author}</span>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-400" />
                    {postItem.likedCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4 text-indigo-500" />
                    {postItem.commentCount}
                  </span>
                </div>
              </div>
            </article>
          ))
        : null}

      {!postsQuery.isLoading && !postsQuery.isError && postItems.length > 0 ? (
        <div className="space-y-3">
          {postsQuery.isFetchingNextPage ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오는 중...
            </section>
          ) : null}

          {!postsQuery.hasNextPage ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              마지막 게시글까지 모두 확인했어요.
            </section>
          ) : null}

          {postsQuery.isFetchNextPageError ? (
            <section className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오지 못했어요.
            </section>
          ) : null}

          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
        </div>
      ) : null}

      {selectedPost && !postsQuery.isLoading && !postsQuery.isError ? (
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

          {selectedPostDetail && !postDetailQuery.isLoading && !postDetailQuery.isError ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      postCategoryStyleMap[selectedPostDetail.category],
                    )}
                  >
                    {selectedPostDetail.category}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatRelativeCreatedAt(selectedPostDetail.createdAt)}
                  </span>
                </div>

                {canEditSelectedPost ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditPostModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>

              <h2 className="mt-5 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
                {selectedPostDetail.title}
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-500">{selectedPostDetail.author}</p>
              <p className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
                {selectedPostDetail.content}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => void handlePostReaction('like')}
                  disabled={isLikePostPending}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                    postDetailQuery.data?.liked
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  <Heart className="h-4 w-4" />
                  {postDetailQuery.data?.likeCount ?? 0}
                </button>
                <button
                  type="button"
                  onClick={() => void handlePostReaction('dislike')}
                  disabled={isDislikePostPending}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                    postDetailQuery.data?.disliked
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {postDetailQuery.data?.dislikeCount ?? 0}
                </button>
              </div>

              {reactionErrorMessage ? (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {reactionErrorMessage}
                </p>
              ) : null}

              <CommentSection
                comments={selectedPostComments}
                isLoading={commentsQuery.isLoading}
                isError={commentsQuery.isError}
                errorMessage={
                  commentsQuery.error instanceof Error
                    ? `댓글을 불러오지 못했어요. ${commentsQuery.error.message}`
                    : '댓글을 불러오지 못했어요.'
                }
                inputValue={commentInputValue}
                onInputChange={setCommentInputValue}
                onSubmit={() => {
                  void handleCommentSubmit();
                }}
                isSubmitPending={isCommentSubmitPending}
                actionMessage={commentActionMessage}
                actionTone={commentActionTone}
                editingCommentId={editingCommentId}
                editingCommentValue={editingCommentValue}
                onEditingChange={setEditingCommentValue}
                onEditStart={(comment) => {
                  setDeletingCommentId(null);
                  setCommentDeleteMessage('');
                  setCommentEditMessage('');
                  setEditingCommentId(comment.id);
                  setEditingCommentValue(comment.content);
                }}
                onEditCancel={() => {
                  setEditingCommentId(null);
                  setEditingCommentValue('');
                  setCommentEditMessage('');
                  setCommentEditTone('success');
                }}
                onEditSubmit={(comment) => {
                  void handleCommentUpdate(comment);
                }}
                editMessage={commentEditMessage}
                editTone={commentEditTone}
                deletingCommentId={deletingCommentId}
                onDeleteStart={(commentId) => {
                  setEditingCommentId(null);
                  setEditingCommentValue('');
                  setCommentEditMessage('');
                  setDeletingCommentId(commentId);
                  setCommentDeleteMessage('');
                }}
                onDeleteCancel={() => {
                  setDeletingCommentId(null);
                  setCommentDeleteMessage('');
                  setCommentDeleteTone('success');
                }}
                onDeleteConfirm={(comment) => {
                  void handleCommentDelete(comment);
                }}
                deleteMessage={commentDeleteMessage}
                deleteTone={commentDeleteTone}
                onLike={(comment) => {
                  void handleCommentReaction(comment, 'like');
                }}
                onDislike={(comment) => {
                  void handleCommentReaction(comment, 'dislike');
                }}
                likingCommentId={likingCommentId}
                dislikingCommentId={dislikingCommentId}
                likeMessage={commentLikeMessage}
                likeTone={commentLikeTone}
                dislikeMessage={commentDislikeMessage}
                dislikeTone={commentDislikeTone}
              />
            </>
          ) : null}
        </article>
      ) : null}

      {selectedPostDetail ? (
        <>
          <CreatePostModal
            isOpen={isEditPostModalOpen}
            onClose={() => setIsEditPostModalOpen(false)}
            onRequireLogin={onRequireLogin}
            mode="edit"
            postId={selectedPostDetail.id}
            initialValues={editPostInitialValues as CreatePostFormValues}
            onSuccess={handleEditPostSuccess}
          />
          <DeletePostConfirmModal
            isOpen={isDeleteConfirmModalOpen}
            isPending={isDeletePostPending}
            errorMessage={deleteErrorMessage}
            onClose={() => setIsDeleteConfirmModalOpen(false)}
            onConfirm={() => {
              void handleDeletePost();
            }}
          />
        </>
      ) : null}
    </section>
  );
};

export default PostSection;
