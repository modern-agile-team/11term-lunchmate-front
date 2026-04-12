import { Heart, MessageSquareText, Pencil, SendHorizonal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/app/authSessionStore';
import {
  commentQueries,
  createComment,
  deleteComment,
  type CommentListItemResponse,
  type GetCommentsResponse,
  likeComment,
  updateComment,
} from '@/shared/api/comments';
import { myUserQueryOptions } from '@/shared/api/users';
import { cn } from '@/shared/lib/utils';
import type { ApiErrorPayload } from '@/shared/types/api';
import type { MainBoardComment } from './types';
import { mockBoardPosts } from './mockBoardPosts';

const COMMENTS_LIST_DEFAULT_PAGE = 1;
const COMMENTS_LIST_DEFAULT_SIZE = 20;

type CommentActionTone = 'success' | 'error';

const categoryStyleMap = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
} as const;

const formatRelativeCreatedAt = (createdAt: string) => {
  const currentTime = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor((currentTime - createdTime) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}일 전`;
};

const toBoardCommentAuthor = (comment: CommentListItemResponse) =>
  comment.author?.trim() ||
  comment.authorNickname?.trim() ||
  comment.userNickname?.trim() ||
  comment.nickname?.trim() ||
  comment.user?.nickname?.trim() ||
  '익명 사용자';

const toMainBoardComment = (
  comment: CommentListItemResponse,
  postId: number,
  currentUserId: number | null,
): MainBoardComment => ({
  id: comment.id,
  postId: comment.postId ?? postId,
  author: toBoardCommentAuthor(comment),
  content: comment.content,
  likedCount: comment.likeCount ?? 0,
  liked: comment.liked ?? false,
  createdAt: comment.createdAt,
  isMine:
    typeof comment.isMine === 'boolean'
      ? comment.isMine
      : currentUserId !== null &&
        (comment.userId === currentUserId || comment.authorId === currentUserId),
});

const getCreateCommentErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 400) {
      return '댓글 내용을 다시 확인해주세요.';
    }

    if (error.response?.status === 404) {
      return '게시글을 찾을 수 없어요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return '댓글을 등록하지 못했어요. 잠시 후 다시 시도해주세요.';
};

const getUpdateCommentErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 403) {
      return '댓글을 수정할 권한이 없어요.';
    }

    if (error.response?.status === 404) {
      return '댓글을 찾을 수 없어요.';
    }

    if (error.response?.status === 400) {
      return '댓글 내용을 다시 확인해주세요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return '댓글을 수정하지 못했어요. 잠시 후 다시 시도해주세요.';
};

const getDeleteCommentErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 403) {
      return '댓글을 삭제할 권한이 없어요.';
    }

    if (error.response?.status === 404) {
      return '댓글을 찾을 수 없어요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return '댓글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.';
};

const getLikeCommentErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 404) {
      return '댓글을 찾을 수 없어요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return '댓글 좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요.';
};

interface MainBoardSectionProps {
  onRequireLogin: () => void;
}

const MainBoardSection = ({ onRequireLogin }: MainBoardSectionProps) => {
  const queryClient = useQueryClient();
  const [boardPosts, setBoardPosts] = useState(mockBoardPosts);
  const initialSelectedBoardPostId = boardPosts[0]?.id ?? null;
  const [selectedBoardPostId, setSelectedBoardPostId] = useState<number | null>(
    initialSelectedBoardPostId,
  );
  const [commentInputValue, setCommentInputValue] = useState('');
  const [commentActionMessage, setCommentActionMessage] = useState('');
  const [commentActionTone, setCommentActionTone] = useState<CommentActionTone>('success');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentValue, setEditingCommentValue] = useState('');
  const [commentEditMessage, setCommentEditMessage] = useState('');
  const [commentEditMessageTone, setCommentEditMessageTone] =
    useState<CommentActionTone>('success');
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentDeleteMessage, setCommentDeleteMessage] = useState('');
  const [commentDeleteMessageTone, setCommentDeleteMessageTone] =
    useState<CommentActionTone>('success');
  const [commentLikeMessage, setCommentLikeMessage] = useState('');
  const [commentLikeMessageTone, setCommentLikeMessageTone] = useState<CommentActionTone>('success');
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const selectedBoardPost = boardPosts.find((boardPost) => boardPost.id === selectedBoardPostId);
  const isLoggedIn = isAuthenticated();
  const { data: currentUser } = useQuery({
    ...myUserQueryOptions(),
    enabled: isLoggedIn,
  });
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    ...commentQueries.list(selectedBoardPostId ?? 0, {
      page: COMMENTS_LIST_DEFAULT_PAGE,
      size: COMMENTS_LIST_DEFAULT_SIZE,
    }),
    enabled: selectedBoardPostId !== null,
  });

  const selectedBoardComments = useMemo(
    () =>
      selectedBoardPostId === null
        ? []
        : (commentsData?.items ?? []).map((comment) =>
            toMainBoardComment(comment, selectedBoardPostId, currentUser?.id ?? null),
          ),
    [commentsData?.items, currentUser?.id, selectedBoardPostId],
  );

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      createComment(postId, { content }),
    onSuccess: (createdComment, variables) => {
      const queryParams = {
        page: COMMENTS_LIST_DEFAULT_PAGE,
        size: COMMENTS_LIST_DEFAULT_SIZE,
      };

      queryClient.setQueryData<GetCommentsResponse | undefined>(
        commentQueries.list(variables.postId, queryParams).queryKey,
        (oldData) => ({
          items: [createdComment, ...(oldData?.items ?? [])],
          pagination: oldData?.pagination,
        }),
      );

      setBoardPosts((currentBoardPosts) =>
        currentBoardPosts.map((boardPost) =>
          boardPost.id === variables.postId
            ? { ...boardPost, commentCount: boardPost.commentCount + 1 }
            : boardPost,
        ),
      );
      setCommentInputValue('');
      setCommentActionMessage('댓글을 등록했어요.');
      setCommentActionTone('success');
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentActionMessage('로그인 후 댓글을 작성할 수 있어요.');
        setCommentActionTone('error');
        onRequireLogin();
        return;
      }

      setCommentActionMessage(getCreateCommentErrorMessage(error));
      setCommentActionTone('error');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      postId,
      commentId,
      content,
    }: {
      postId: number;
      commentId: number;
      content: string;
    }) => updateComment(postId, commentId, { content }),
    onSuccess: (updatedComment, variables) => {
      const queryParams = {
        page: COMMENTS_LIST_DEFAULT_PAGE,
        size: COMMENTS_LIST_DEFAULT_SIZE,
      };

      queryClient.setQueryData<GetCommentsResponse | undefined>(
        commentQueries.list(variables.postId, queryParams).queryKey,
        (oldData) => {
          if (oldData === undefined) {
            return oldData;
          }

          return {
            ...oldData,
            items: oldData.items.map((comment) =>
              comment.id === variables.commentId ? { ...comment, ...updatedComment } : comment,
            ),
          };
        },
      );

      setEditingCommentId(null);
      setEditingCommentValue('');
      setCommentEditMessage('댓글을 수정했어요.');
      setCommentEditMessageTone('success');
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentEditMessage('로그인 후 댓글을 수정할 수 있어요.');
        setCommentEditMessageTone('error');
        onRequireLogin();
        return;
      }

      setCommentEditMessage(getUpdateCommentErrorMessage(error));
      setCommentEditMessageTone('error');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      const queryParams = {
        page: COMMENTS_LIST_DEFAULT_PAGE,
        size: COMMENTS_LIST_DEFAULT_SIZE,
      };

      queryClient.setQueryData<GetCommentsResponse | undefined>(
        commentQueries.list(variables.postId, queryParams).queryKey,
        (oldData) => {
          if (oldData === undefined) {
            return oldData;
          }

          return {
            ...oldData,
            items: oldData.items.filter((comment) => comment.id !== variables.commentId),
          };
        },
      );

      setBoardPosts((currentBoardPosts) =>
        currentBoardPosts.map((boardPost) =>
          boardPost.id === variables.postId
            ? { ...boardPost, commentCount: Math.max(0, boardPost.commentCount - 1) }
            : boardPost,
        ),
      );
      setDeletingCommentId(null);
      setEditingCommentId(null);
      setEditingCommentValue('');
      setCommentDeleteMessage('댓글을 삭제했어요.');
      setCommentDeleteMessageTone('success');
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentDeleteMessage('로그인 후 댓글을 삭제할 수 있어요.');
        setCommentDeleteMessageTone('error');
        onRequireLogin();
        return;
      }

      setCommentDeleteMessage(getDeleteCommentErrorMessage(error));
      setCommentDeleteMessageTone('error');
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      likeComment(postId, commentId),
    onMutate: ({ commentId }) => {
      setLikingCommentId(commentId);
      setCommentLikeMessage('');
      setCommentLikeMessageTone('success');
    },
    onSuccess: (likedComment, variables) => {
      const queryParams = {
        page: COMMENTS_LIST_DEFAULT_PAGE,
        size: COMMENTS_LIST_DEFAULT_SIZE,
      };

      queryClient.setQueryData<GetCommentsResponse | undefined>(
        commentQueries.list(variables.postId, queryParams).queryKey,
        (oldData) => {
          if (oldData === undefined) {
            return oldData;
          }

          return {
            ...oldData,
            items: oldData.items.map((comment) =>
              comment.id === variables.commentId
                ? {
                    ...comment,
                    liked: likedComment.liked,
                    likeCount: likedComment.likeCount,
                  }
                : comment,
            ),
          };
        },
      );
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentLikeMessage('로그인 후 댓글을 좋아요할 수 있어요.');
        setCommentLikeMessageTone('error');
        onRequireLogin();
        return;
      }

      setCommentLikeMessage(getLikeCommentErrorMessage(error));
      setCommentLikeMessageTone('error');
    },
    onSettled: () => {
      setLikingCommentId(null);
    },
  });

  const handleCommentSubmit = () => {
    if (selectedBoardPostId === null) {
      return;
    }

    const trimmedContent = commentInputValue.trim();

    if (trimmedContent === '') {
      setCommentActionMessage('댓글 내용을 다시 확인해주세요.');
      setCommentActionTone('error');
      return;
    }

    setCommentActionMessage('');
    createCommentMutation.mutate({
      postId: selectedBoardPostId,
      content: trimmedContent,
    });
  };

  const handleCommentEditStart = (comment: MainBoardComment) => {
    if (editingCommentId !== null && editingCommentId !== comment.id) {
      return;
    }

    setDeletingCommentId(null);
    setCommentDeleteMessage('');
    setCommentDeleteMessageTone('success');
    setCommentEditMessage('');
    setCommentEditMessageTone('success');
    setEditingCommentId(comment.id);
    setEditingCommentValue(comment.content);
  };

  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditingCommentValue('');
    setCommentEditMessage('');
    setCommentEditMessageTone('success');
  };

  const handleCommentUpdate = (comment: MainBoardComment) => {
    const trimmedContent = editingCommentValue.trim();

    if (trimmedContent === '') {
      setCommentEditMessage('댓글 내용을 다시 확인해주세요.');
      setCommentEditMessageTone('error');
      return;
    }

    setCommentEditMessage('');
    updateCommentMutation.mutate({
      postId: comment.postId,
      commentId: comment.id,
      content: trimmedContent,
    });
  };

  const handleCommentDeleteStart = (commentId: number) => {
    if (deletingCommentId !== null && deletingCommentId !== commentId) {
      return;
    }

    setEditingCommentId(null);
    setEditingCommentValue('');
    setCommentEditMessage('');
    setCommentEditMessageTone('success');
    setCommentDeleteMessage('');
    setCommentDeleteMessageTone('success');
    setDeletingCommentId(commentId);
  };

  const handleCommentDeleteCancel = () => {
    setDeletingCommentId(null);
    setCommentDeleteMessage('');
    setCommentDeleteMessageTone('success');
  };

  const handleCommentDelete = (comment: MainBoardComment) => {
    setCommentDeleteMessage('');
    deleteCommentMutation.mutate({
      postId: comment.postId,
      commentId: comment.id,
    });
  };

  const handleCommentLike = (comment: MainBoardComment) => {
    setCommentLikeMessage('');
    setCommentLikeMessageTone('success');
    likeCommentMutation.mutate({
      postId: comment.postId,
      commentId: comment.id,
    });
  };

  return (
    <section className="space-y-4 md:space-y-5">
      {boardPosts.map((mockBoardPost) => (
        <article
          key={mockBoardPost.id}
          className={cn(
            'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
            selectedBoardPostId === mockBoardPost.id
              ? 'border-indigo-200 ring-4 ring-indigo-100/60'
              : 'border-slate-200/80 hover:border-slate-300',
          )}
          onClick={() => {
            setSelectedBoardPostId(mockBoardPost.id);
            setEditingCommentId(null);
            setEditingCommentValue('');
            setCommentEditMessage('');
            setCommentEditMessageTone('success');
            setDeletingCommentId(null);
            setCommentDeleteMessage('');
            setCommentDeleteMessageTone('success');
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                categoryStyleMap[mockBoardPost.category],
              )}
            >
              {mockBoardPost.category}
            </span>
            <span className="text-sm text-slate-400">
              {formatRelativeCreatedAt(mockBoardPost.createdAt)}
            </span>
          </div>

          <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
            {mockBoardPost.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{mockBoardPost.summary}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{mockBoardPost.author}</span>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" />
                {mockBoardPost.likedCount}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquareText className="h-4 w-4 text-indigo-500" />
                {mockBoardPost.commentCount}
              </span>
            </div>
          </div>
        </article>
      ))}

      {selectedBoardPost ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  categoryStyleMap[selectedBoardPost.category],
                )}
              >
                {selectedBoardPost.category}
              </span>
              <span className="text-sm text-slate-400">
                {formatRelativeCreatedAt(selectedBoardPost.createdAt)}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Heart className="h-4 w-4 text-rose-400" />
              {selectedBoardPost.likedCount}
            </div>
          </div>

          <h3 className="mt-5 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
            {selectedBoardPost.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500">{selectedBoardPost.author}</p>

          <div className="mt-6 whitespace-pre-line rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
            {selectedBoardPost.content}
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-bold tracking-[-0.03em] text-slate-900">
                댓글 {selectedBoardPost.commentCount}
              </h4>
              <span className="text-sm text-slate-400">목록 조회 연결</span>
            </div>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">댓글 작성</span>
                <textarea
                  value={commentInputValue}
                  onChange={(event) => setCommentInputValue(event.target.value)}
                  placeholder="점심메이트와 나누고 싶은 이야기를 남겨보세요."
                  className="mt-3 min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/70"
                />
              </label>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p
                  className={cn(
                    'text-xs font-medium',
                    commentActionMessage === ''
                      ? 'text-slate-400'
                      : commentActionTone === 'success'
                        ? 'text-emerald-600'
                        : 'text-rose-600',
                  )}
                >
                  {commentActionMessage || '댓글을 등록하면 목록 맨 위에 바로 보여요.'}
                </p>

                <button
                  type="button"
                  onClick={handleCommentSubmit}
                  disabled={createCommentMutation.isPending}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition',
                    createCommentMutation.isPending
                      ? 'cursor-not-allowed bg-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800',
                  )}
                >
                  <SendHorizonal className="h-4 w-4" />
                  {createCommentMutation.isPending ? '등록 중...' : '댓글 등록'}
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {commentDeleteMessage !== '' ? (
                <div
                  className={cn(
                    'rounded-[24px] border px-5 py-4 text-center text-sm',
                    commentDeleteMessageTone === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-rose-200 bg-rose-50 text-rose-600',
                  )}
                >
                  {commentDeleteMessage}
                </div>
              ) : null}

              {commentEditMessage !== '' ? (
                <div
                  className={cn(
                    'rounded-[24px] border px-5 py-4 text-center text-sm',
                    commentEditMessageTone === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-rose-200 bg-rose-50 text-rose-600',
                  )}
                >
                  {commentEditMessage}
                </div>
              ) : null}

              {commentLikeMessage !== '' ? (
                <div
                  className={cn(
                    'rounded-[24px] border px-5 py-4 text-center text-sm',
                    commentLikeMessageTone === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-rose-200 bg-rose-50 text-rose-600',
                  )}
                >
                  {commentLikeMessage}
                </div>
              ) : null}

              {isCommentsLoading ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm text-slate-500">
                  댓글을 불러오는 중...
                </div>
              ) : null}

              {isCommentsError ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-6 text-center text-sm text-rose-600">
                  댓글을 불러오지 못했어요.
                  {commentsError instanceof Error ? ` ${commentsError.message}` : ''}
                </div>
              ) : null}

              {!isCommentsLoading && !isCommentsError && selectedBoardComments.length === 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm text-slate-500">
                  아직 등록된 댓글이 없어요.
                </div>
              ) : null}

              {!isCommentsLoading && !isCommentsError
                ? selectedBoardComments.map((selectedBoardComment) => (
                    <article
                      key={selectedBoardComment.id}
                      className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {selectedBoardComment.author}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {formatRelativeCreatedAt(selectedBoardComment.createdAt)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                          <button
                            type="button"
                            onClick={() => handleCommentLike(selectedBoardComment)}
                            disabled={likingCommentId === selectedBoardComment.id}
                            className={cn(
                              'inline-flex items-center gap-1 transition',
                              likingCommentId === selectedBoardComment.id
                                ? 'cursor-not-allowed opacity-60'
                                : selectedBoardComment.liked
                                  ? 'text-rose-500 hover:text-rose-600'
                                  : 'text-slate-400 hover:text-rose-500',
                            )}
                          >
                            <Heart className="h-3.5 w-3.5 text-rose-400" />
                            {selectedBoardComment.likedCount}
                          </button>

                          {selectedBoardComment.isMine ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCommentEditStart(selectedBoardComment)}
                                disabled={
                                  updateCommentMutation.isPending ||
                                  deleteCommentMutation.isPending ||
                                  deletingCommentId !== null ||
                                  (editingCommentId !== null &&
                                    editingCommentId !== selectedBoardComment.id)
                                }
                                className={cn(
                                  'inline-flex items-center gap-1',
                                  updateCommentMutation.isPending ||
                                    deleteCommentMutation.isPending ||
                                    deletingCommentId !== null ||
                                    (editingCommentId !== null &&
                                      editingCommentId !== selectedBoardComment.id)
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'text-slate-500 hover:text-slate-700',
                                )}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCommentDeleteStart(selectedBoardComment.id)}
                                disabled={
                                  deleteCommentMutation.isPending ||
                                  editingCommentId !== null ||
                                  (deletingCommentId !== null &&
                                    deletingCommentId !== selectedBoardComment.id)
                                }
                                className={cn(
                                  'inline-flex items-center gap-1',
                                  deleteCommentMutation.isPending ||
                                    editingCommentId !== null ||
                                    (deletingCommentId !== null &&
                                      deletingCommentId !== selectedBoardComment.id)
                                    ? 'cursor-not-allowed opacity-60'
                                    : 'text-slate-500 hover:text-rose-600',
                                )}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                삭제
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {editingCommentId === selectedBoardComment.id ? (
                        <div className="mt-3 space-y-3">
                          <textarea
                            value={editingCommentValue}
                            onChange={(event) => setEditingCommentValue(event.target.value)}
                            className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/70"
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleCommentEditCancel}
                              disabled={updateCommentMutation.isPending}
                              className={cn(
                                'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                                updateCommentMutation.isPending
                                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                              )}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCommentUpdate(selectedBoardComment)}
                              disabled={updateCommentMutation.isPending}
                              className={cn(
                                'rounded-2xl px-4 py-2 text-sm font-semibold text-white transition',
                                updateCommentMutation.isPending
                                  ? 'cursor-not-allowed bg-slate-300'
                                  : 'bg-slate-900 hover:bg-slate-800',
                              )}
                            >
                              {updateCommentMutation.isPending ? '수정 중...' : '수정 완료'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {selectedBoardComment.content}
                        </p>
                      )}

                      {deletingCommentId === selectedBoardComment.id ? (
                        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4">
                          <p className="text-sm font-medium text-rose-700">
                            정말 삭제할까요?
                          </p>
                          <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleCommentDeleteCancel}
                              disabled={deleteCommentMutation.isPending}
                              className={cn(
                                'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                                deleteCommentMutation.isPending
                                  ? 'cursor-not-allowed bg-white text-slate-400'
                                  : 'bg-white text-slate-600 hover:bg-slate-100',
                              )}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCommentDelete(selectedBoardComment)}
                              disabled={deleteCommentMutation.isPending}
                              className={cn(
                                'rounded-2xl px-4 py-2 text-sm font-semibold text-white transition',
                                deleteCommentMutation.isPending
                                  ? 'cursor-not-allowed bg-rose-300'
                                  : 'bg-rose-500 hover:bg-rose-600',
                              )}
                            >
                              {deleteCommentMutation.isPending ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  ))
                : null}
            </div>
          </section>
        </article>
      ) : null}
    </section>
  );
};

export default MainBoardSection;
