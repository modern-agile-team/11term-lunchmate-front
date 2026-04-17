import { Heart, MessageSquareText, PencilLine, SendHorizonal, ThumbsDown, Trash2, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { MainPostComment } from '@/widgets/post-section/model/types';

type MessageTone = 'success' | 'error';

interface CommentSectionProps {
  comments: MainPostComment[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitPending: boolean;
  actionMessage: string;
  actionTone: MessageTone;
  editingCommentId: number | null;
  editingCommentValue: string;
  onEditingChange: (value: string) => void;
  onEditStart: (comment: MainPostComment) => void;
  onEditCancel: () => void;
  onEditSubmit: (comment: MainPostComment) => void;
  editMessage: string;
  editTone: MessageTone;
  deletingCommentId: number | null;
  onDeleteStart: (commentId: number) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (comment: MainPostComment) => void;
  deleteMessage: string;
  deleteTone: MessageTone;
  onLike: (comment: MainPostComment) => void;
  onDislike: (comment: MainPostComment) => void;
  likingCommentId: number | null;
  dislikingCommentId: number | null;
  likeMessage: string;
  likeTone: MessageTone;
  dislikeMessage: string;
  dislikeTone: MessageTone;
}

const messageClassName = (tone: MessageTone) =>
  cn(
    'rounded-2xl border px-4 py-3 text-sm',
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-600'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700',
  );

const CommentSection = ({
  comments,
  isLoading,
  isError,
  errorMessage,
  inputValue,
  onInputChange,
  onSubmit,
  isSubmitPending,
  actionMessage,
  actionTone,
  editingCommentId,
  editingCommentValue,
  onEditingChange,
  onEditStart,
  onEditCancel,
  onEditSubmit,
  editMessage,
  editTone,
  deletingCommentId,
  onDeleteStart,
  onDeleteCancel,
  onDeleteConfirm,
  deleteMessage,
  deleteTone,
  onLike,
  onDislike,
  likingCommentId,
  dislikingCommentId,
  likeMessage,
  likeTone,
  dislikeMessage,
  dislikeTone,
}: CommentSectionProps) => {
  return (
    <section className="mt-8 space-y-4 border-t border-slate-200 pt-6">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-900">댓글</h3>
        <span className="text-sm text-slate-500">{comments.length}개</span>
      </div>

      <div className="rounded-[24px] bg-slate-50 p-4">
        <textarea
          rows={4}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="댓글을 입력해주세요"
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            <SendHorizonal className="h-4 w-4" />
            {isSubmitPending ? '등록 중...' : '댓글 등록'}
          </button>
        </div>
      </div>

      {actionMessage ? <p className={messageClassName(actionTone)}>{actionMessage}</p> : null}
      {editMessage ? <p className={messageClassName(editTone)}>{editMessage}</p> : null}
      {deleteMessage ? <p className={messageClassName(deleteTone)}>{deleteMessage}</p> : null}
      {likeMessage ? <p className={messageClassName(likeTone)}>{likeMessage}</p> : null}
      {dislikeMessage ? <p className={messageClassName(dislikeTone)}>{dislikeMessage}</p> : null}

      {isLoading ? (
        <div className="rounded-[24px] bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
          댓글을 불러오는 중...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-600">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !isError && comments.length === 0 ? (
        <div className="rounded-[24px] bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
          아직 댓글이 없어요.
        </div>
      ) : null}

      {!isLoading && !isError
        ? comments.map((comment) => {
            const isEditing = editingCommentId === comment.id;
            const isDeleting = deletingCommentId === comment.id;
            const isLiking = likingCommentId === comment.id;
            const isDisliking = dislikingCommentId === comment.id;

            return (
              <article
                key={comment.id}
                className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{comment.author}</p>
                    <p className="mt-1 text-xs text-slate-400">{comment.createdAt}</p>
                  </div>

                  {comment.isMine ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditStart(comment)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteStart(comment.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      rows={4}
                      value={editingCommentValue}
                      onChange={(event) => onEditingChange(event.target.value)}
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onEditCancel}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditSubmit(comment)}
                        className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
                      >
                        수정 저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {comment.content}
                  </p>
                )}

                {isDeleting ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-rose-600">이 댓글을 삭제할까요? 되돌릴 수 없어요.</p>
                      <button
                        type="button"
                        onClick={onDeleteCancel}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 transition hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onDeleteCancel}
                        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteConfirm(comment)}
                        className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onLike(comment)}
                    disabled={isLiking}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition',
                      comment.liked
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    )}
                  >
                    <Heart className="h-4 w-4" />
                    {isLiking ? '반영 중...' : comment.likedCount}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDislike(comment)}
                    disabled={isDisliking}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition',
                      comment.disliked
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    )}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    {isDisliking ? '반영 중...' : comment.dislikeCount}
                  </button>
                </div>
              </article>
            );
          })
        : null}
    </section>
  );
};

export default CommentSection;
