import { Heart, MessageSquareText, PencilLine, ThumbsDown, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  commentQueries,
  createComment,
  deleteComment,
  type CommentListItemResponse,
  type GetCommentsResponse,
  updateComment,
} from '@/shared/api/comments';
import { myUserQueryOptions } from '@/shared/api/users';
  deletePost,
  dislikePost,
  type GetPostsResponse,
  likePost,
  postQueries,
  type PostDetailResponse,
  type PostListItemResponse,
} from '@/shared/api/posts';
import { myUserQueryOptions } from '@/shared/api/users/meQueries';
import { cn } from '@/shared/lib/utils';
import type { MainBoardPost, MainBoardPostSyncRequest } from './types';
import {
  boardCategoryFilterOptions,
  boardCategoryIdLabelMap,
  boardCategoryIdMap,
  boardCategoryStyleMap,
  type MainBoardCategoryFilter,
} from './board.constants';
import CreatePostModal, { type CreatePostFormValues } from './CreatePostModal';
import DeletePostConfirmModal from './DeletePostConfirmModal';

const BOARD_LIST_DEFAULT_PAGE = 1;
const BOARD_LIST_DEFAULT_SIZE = 10;

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

const toBoardCategory = (
  post:
    | Pick<PostListItemResponse, 'category' | 'categoryId'>
    | Pick<PostDetailResponse, 'category' | 'categoryId'>,
): MainBoardPost['category'] => {
  if (
    post.category === 'FREE' ||
    post.category === 'REVIEW' ||
    post.category === 'INFO' ||
    post.category === 'TALK'
  ) {
    return post.category;
  }

  if (post.categoryId !== undefined && post.categoryId !== null) {
    return boardCategoryIdLabelMap[post.categoryId] ?? 'FREE';
  }

  return 'FREE';
};

const toBoardAuthor = (post: PostListItemResponse) =>
  post.author?.trim() ||
  post.authorNickname?.trim() ||
  post.userNickname?.trim() ||
  post.nickname?.trim() ||
  post.user?.nickname?.trim() ||
  post.user?.name?.trim() ||
  '익명 사용자';

const toBoardSummary = (post: PostListItemResponse) => {
  const sourceText = post.summary?.trim() || post.content?.trim() || '';

  if (sourceText === '') {
    return '게시글 요약이 아직 없어요.';
  }

  if (sourceText.length <= 90) {
    return sourceText;
  }

  return `${sourceText.slice(0, 90).trimEnd()}...`;
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
const toMainBoardPost = (post: PostListItemResponse): MainBoardPost => ({
  id: post.id,
  category: toBoardCategory(post),
  title: post.title,
  author: toBoardAuthor(post),
  summary: toBoardSummary(post),
  content: post.content ?? '',
  likedCount: post.likeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
});

const toMainBoardPostDetail = (
  post: PostDetailResponse,
  author: string,
): MainBoardPost => ({
  id: post.id,
  category: toBoardCategory(post),
  title: post.title,
  author,
  summary: post.content,
  content: post.content,
  likedCount: post.likeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
});

const toEditPostFormValues = (post: MainBoardPost): CreatePostFormValues => ({
  category: post.category,
  title: post.title,
  content: post.content,
});

const isPostListData = (value: unknown): value is GetPostsResponse =>
  typeof value === 'object' &&
  value !== null &&
  'items' in value &&
  Array.isArray((value as { items?: unknown }).items);

const isInfinitePostListData = (
  value: unknown,
): value is { pages: GetPostsResponse[]; pageParams: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  'pages' in value &&
  Array.isArray((value as { pages?: unknown }).pages);

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

interface MainBoardSectionProps {
  postSyncRequest: MainBoardPostSyncRequest | null;
  onPostSyncHandled: () => void;
  onRequireLogin: () => void;
}

const MainBoardSection = ({
  postSyncRequest,
  onPostSyncHandled,
  onRequireLogin,
}: MainBoardSectionProps) => {
  const queryClient = useQueryClient();
  const [selectedBoardPostId, setSelectedBoardPostId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MainBoardCategoryFilter>('ALL');
  const [pendingSyncedPostId, setPendingSyncedPostId] = useState<number | null>(null);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [reactionErrorMessage, setReactionErrorMessage] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const categoryId =
    selectedCategory === 'ALL' ? undefined : boardCategoryIdMap[selectedCategory];
  const { data: myUserData } = useQuery(myUserQueryOptions());
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery(
    postQueries.infiniteList({
      page: BOARD_LIST_DEFAULT_PAGE,
      size: BOARD_LIST_DEFAULT_SIZE,
      categoryId,
    }),
  );
  const boardPosts = useMemo(
    () => data?.pages.flatMap((page) => page.items).map(toMainBoardPost) ?? [],
    [data],
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
  const selectedBoardPost = boardPosts.find((boardPost) => boardPost.id === selectedBoardPostId);
  const {
    data: selectedBoardPostDetailData,
    isLoading: isBoardDetailLoading,
    isError: isBoardDetailError,
    error: boardDetailError,
  } = useQuery({
    ...postQueries.detail(selectedBoardPostId ?? 0),
    enabled: selectedBoardPostId !== null,
  });
  const selectedBoardPostDetail =
    selectedBoardPostDetailData && selectedBoardPost
      ? toMainBoardPostDetail(selectedBoardPostDetailData, selectedBoardPost.author)
      : null;
  const isSelectedBoardPostLiked = selectedBoardPostDetailData?.liked ?? false;
  const isSelectedBoardPostDisliked = selectedBoardPostDetailData?.disliked ?? false;
  const canEditSelectedPost =
    selectedBoardPostDetailData !== undefined && myUserData?.id === selectedBoardPostDetailData.userId;
  const hasLoadedPosts = data !== undefined;
  const likePostMutation = useMutation({
    mutationFn: likePost,
  });
  const dislikePostMutation = useMutation({
    mutationFn: dislikePost,
  });
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
  });

  useEffect(() => {
    if (!postSyncRequest) {
      return;
    }

    if (selectedCategory !== 'ALL' && selectedCategory !== postSyncRequest.category) {
      setSelectedCategory(postSyncRequest.category);
    }

    setPendingSyncedPostId(postSyncRequest.postId);
    setSelectedBoardPostId(postSyncRequest.postId);
    onPostSyncHandled();
  }, [onPostSyncHandled, postSyncRequest, selectedCategory]);

  useEffect(() => {
    if (boardPosts.length === 0) {
      if (pendingSyncedPostId !== null && isFetching) {
        return;
      }

      setSelectedBoardPostId(null);
      return;
    }

    if (pendingSyncedPostId !== null) {
      const hasPendingSyncedPost = boardPosts.some(
        (boardPost) => boardPost.id === pendingSyncedPostId,
      );

      if (hasPendingSyncedPost) {
        setSelectedBoardPostId(pendingSyncedPostId);
        setPendingSyncedPostId(null);
        return;
      }

      if (isFetching) {
        return;
      }
    }

    const hasSelectedBoardPost =
      selectedBoardPostId !== null &&
      boardPosts.some((boardPost) => boardPost.id === selectedBoardPostId);

    if (!hasSelectedBoardPost) {
      setSelectedBoardPostId(boardPosts[0].id);
    }
  }, [boardPosts, isFetching, pendingSyncedPostId, selectedBoardPostId]);

  useEffect(() => {
    setReactionErrorMessage('');
  }, [selectedBoardPostId]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || isLoading || isError || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) {
        return;
      }

      void fetchNextPage();
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading]);

  const handleDeleteConfirmClose = () => {
    if (deletePostMutation.isPending) {
      return;
    }

    setDeleteErrorMessage('');
    setIsDeleteConfirmModalOpen(false);
  };

  const handleLikePost = async () => {
    if (!selectedBoardPostDetailData) {
      return;
    }

    setReactionErrorMessage('');

    const wasDisliked = selectedBoardPostDetailData.disliked ?? false;
    const currentDislikeCount = selectedBoardPostDetailData.dislikeCount ?? 0;

    try {
      const response = await likePostMutation.mutateAsync(selectedBoardPostDetailData.id);
      const nextDislikeCount =
        response.liked && wasDisliked ? Math.max(0, currentDislikeCount - 1) : currentDislikeCount;

      queryClient.setQueryData<PostDetailResponse>(
        postQueries.detail(selectedBoardPostDetailData.id).queryKey,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            liked: response.liked,
            disliked: response.liked && wasDisliked ? false : currentData.disliked,
            likeCount: response.likeCount,
            dislikeCount: nextDislikeCount,
          };
        },
      );

      queryClient.setQueriesData({ queryKey: postQueries.lists() }, (currentData) => {
        if (isPostListData(currentData)) {
          return {
            ...currentData,
            items: currentData.items.map((item) =>
              item.id === selectedBoardPostDetailData.id
                ? {
                    ...item,
                    likeCount: response.likeCount,
                    dislikeCount: nextDislikeCount,
                  }
                : item,
            ),
          };
        }

        if (isInfinitePostListData(currentData)) {
          return {
            ...currentData,
            pages: currentData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === selectedBoardPostDetailData.id
                  ? {
                      ...item,
                      likeCount: response.likeCount,
                      dislikeCount: nextDislikeCount,
                    }
                  : item,
              ),
            })),
          };
        }

        return currentData;
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
          };
        };

        if (axiosError.response?.status === 401) {
          setReactionErrorMessage('로그인 후 게시글을 좋아요할 수 있어요.');
          onRequireLogin();
          return;
        }

        if (axiosError.response?.status === 404) {
          setReactionErrorMessage('게시글을 찾을 수 없어요.');
          return;
        }
      }

      setReactionErrorMessage('좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleDislikePost = async () => {
    if (!selectedBoardPostDetailData) {
      return;
    }

    setReactionErrorMessage('');

    const wasLiked = selectedBoardPostDetailData.liked ?? false;
    const currentLikeCount = selectedBoardPostDetailData.likeCount ?? 0;

    try {
      const response = await dislikePostMutation.mutateAsync(selectedBoardPostDetailData.id);
      const nextLikeCount =
        response.disliked && wasLiked ? Math.max(0, currentLikeCount - 1) : currentLikeCount;

      queryClient.setQueryData<PostDetailResponse>(
        postQueries.detail(selectedBoardPostDetailData.id).queryKey,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            liked: response.disliked && wasLiked ? false : currentData.liked,
            disliked: response.disliked,
            likeCount: nextLikeCount,
            dislikeCount: response.dislikeCount,
          };
        },
      );

      queryClient.setQueriesData({ queryKey: postQueries.lists() }, (currentData) => {
        if (isPostListData(currentData)) {
          return {
            ...currentData,
            items: currentData.items.map((item) =>
              item.id === selectedBoardPostDetailData.id
                ? {
                    ...item,
                    likeCount: nextLikeCount,
                    dislikeCount: response.dislikeCount,
                  }
                : item,
            ),
          };
        }

        if (isInfinitePostListData(currentData)) {
          return {
            ...currentData,
            pages: currentData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === selectedBoardPostDetailData.id
                  ? {
                      ...item,
                      likeCount: nextLikeCount,
                      dislikeCount: response.dislikeCount,
                    }
                  : item,
              ),
            })),
          };
        }

        return currentData;
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
          };
        };

        if (axiosError.response?.status === 401) {
          setReactionErrorMessage('로그인 후 게시글을 싫어요할 수 있어요.');
          onRequireLogin();
          return;
        }

        if (axiosError.response?.status === 404) {
          setReactionErrorMessage('게시글을 찾을 수 없어요.');
          return;
        }
      }

      setReactionErrorMessage('싫어요를 반영하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleDeletePost = async () => {
    if (!selectedBoardPostDetail) {
      return;
    }

    setDeleteErrorMessage('');

    try {
      await deletePostMutation.mutateAsync(selectedBoardPostDetail.id);

      const nextBoardPost = boardPosts.find(
        (boardPost) => boardPost.id !== selectedBoardPostDetail.id,
      );

      queryClient.setQueriesData({ queryKey: postQueries.lists() }, (currentData) => {
        if (isPostListData(currentData)) {
          return {
            ...currentData,
            items: currentData.items.filter((item) => item.id !== selectedBoardPostDetail.id),
          };
        }

        if (isInfinitePostListData(currentData)) {
          return {
            ...currentData,
            pages: currentData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== selectedBoardPostDetail.id),
            })),
          };
        }

        return currentData;
      });

      setIsDeleteConfirmModalOpen(false);
      setIsEditPostModalOpen(false);
      setDeleteErrorMessage('');
      setPendingSyncedPostId(nextBoardPost?.id ?? null);
      setSelectedBoardPostId(nextBoardPost?.id ?? null);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueries.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueries.details() }),
      ]);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number;
          };
        };

        if (axiosError.response?.status === 401) {
          setDeleteErrorMessage('로그인 후 게시글을 삭제할 수 있어요.');
          onRequireLogin();
          return;
        }

        if (axiosError.response?.status === 403) {
          setDeleteErrorMessage('게시글을 삭제할 권한이 없어요.');
          return;
        }

        if (axiosError.response?.status === 404) {
          setDeleteErrorMessage('게시글을 찾을 수 없어요.');
          return;
        }
      }

      setDeleteErrorMessage('게시글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  };

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
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
        <div>
          <p className="text-sm font-semibold text-slate-700">카테고리</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {boardCategoryFilterOptions.map((option) => (
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
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오는 중...
        </section>
      ) : null}

      {isError ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오지 못했어요.
          {error instanceof Error ? ` ${error.message}` : ''}
        </section>
      ) : null}

      {!isLoading && !isError && boardPosts.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          아직 등록된 게시글이 없어요.
        </section>
      ) : null}

      {!isLoading && !isError
        ? boardPosts.map((boardPost) => (
            <article
              key={boardPost.id}
              className={cn(
                'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
                selectedBoardPostId === boardPost.id
                  ? 'border-indigo-200 ring-4 ring-indigo-100/60'
                  : 'border-slate-200/80 hover:border-slate-300',
              )}
              onClick={() => setSelectedBoardPostId(boardPost.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                    boardCategoryStyleMap[boardPost.category],
                  )}
                >
                  {boardPost.category}
                </span>
                <span className="text-sm text-slate-400">
                  {formatRelativeCreatedAt(boardPost.createdAt)}
                </span>
              </div>

              <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
                {boardPost.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{boardPost.summary}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span className="font-medium text-slate-700">{boardPost.author}</span>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-400" />
                    {boardPost.likedCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4 text-indigo-500" />
                    {boardPost.commentCount}
                  </span>
                </div>
              </div>
            </article>
          ))
        : null}

      {!isLoading && !isError && boardPosts.length > 0 ? (
        <div className="space-y-3">
          {isFetchingNextPage ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오는 중...
            </section>
          ) : null}

          {!hasNextPage && hasLoadedPosts ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              마지막 게시글까지 모두 확인했어요.
            </section>
          ) : null}

          {isFetchNextPageError ? (
            <section className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오지 못했어요.
            </section>
          ) : null}

          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
        </div>
      ) : null}

      {selectedBoardPost && !isLoading && !isError ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          {isBoardDetailLoading ? (
            <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              게시글 상세를 불러오는 중...
            </div>
          ) : null}

          {isBoardDetailError ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
              게시글 상세를 불러오지 못했어요.
              {boardDetailError instanceof Error ? ` ${boardDetailError.message}` : ''}
            </div>
          ) : null}

          {selectedBoardPostDetail && !isBoardDetailLoading && !isBoardDetailError ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      boardCategoryStyleMap[selectedBoardPostDetail.category],
                    )}
                  >
                    {selectedBoardPostDetail.category}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatRelativeCreatedAt(selectedBoardPostDetail.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <button
                      type="button"
                      onClick={() => {
                        void handleLikePost();
                      }}
                      disabled={likePostMutation.isPending || dislikePostMutation.isPending}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition',
                        isSelectedBoardPostLiked
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                        (likePostMutation.isPending || dislikePostMutation.isPending) &&
                          'cursor-not-allowed opacity-60',
                      )}
                    >
                      <Heart className="h-4 w-4 text-rose-400" />
                      {selectedBoardPostDetail.likedCount}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleDislikePost();
                      }}
                      disabled={likePostMutation.isPending || dislikePostMutation.isPending}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition',
                        isSelectedBoardPostDisliked
                          ? 'bg-slate-200 text-slate-700'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                        (likePostMutation.isPending || dislikePostMutation.isPending) &&
                          'cursor-not-allowed opacity-60',
                      )}
                    >
                      <ThumbsDown className="h-4 w-4 text-slate-500" />
                      {selectedBoardPostDetailData?.dislikeCount ?? 0}
                    </button>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquareText className="h-4 w-4 text-indigo-500" />
                      {selectedBoardPostDetail.commentCount}
                    </span>
                  </div>

                  {canEditSelectedPost ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditPostModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        게시글 수정
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDeleteConfirmModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        게시글 삭제
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <h3 className="mt-5 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                {selectedBoardPostDetail.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {selectedBoardPostDetail.author}
              </p>

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
              <div className="mt-4 text-xs font-medium text-slate-400">
                조회 {selectedBoardPostDetailData?.viewCount ?? 0}
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
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-400" />
                            {selectedBoardComment.likedCount}
                          </span>

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

                      <p className="mt-3 text-xs font-medium text-slate-400">
                        댓글 좋아요는 #88에서 연결 예정이에요.
                      </p>
                    </article>
                  ))
                : null}
            </div>
          </section>
              {reactionErrorMessage ? (
                <p className="mt-4 text-sm font-medium text-rose-500">{reactionErrorMessage}</p>
              ) : null}

              <div className="mt-6 whitespace-pre-line rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
                {selectedBoardPostDetail.content}
              </div>

              <div className="mt-6 rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
              </div>
            </>
          ) : null}
        </article>
      ) : null}

      {selectedBoardPostDetail ? (
        <CreatePostModal
          isOpen={isEditPostModalOpen}
          mode="edit"
          postId={selectedBoardPostDetail.id}
          initialValues={toEditPostFormValues(selectedBoardPostDetail)}
          onClose={() => setIsEditPostModalOpen(false)}
          onRequireLogin={onRequireLogin}
          onSuccess={(post) => {
            setPendingSyncedPostId(post.postId);
            setSelectedBoardPostId(post.postId);

            if (selectedCategory !== 'ALL' && selectedCategory !== post.category) {
              setSelectedCategory(post.category);
            }
          }}
        />
      ) : null}

      <DeletePostConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        isPending={deletePostMutation.isPending}
        errorMessage={deleteErrorMessage}
        onClose={handleDeleteConfirmClose}
        onConfirm={() => {
          void handleDeletePost();
        }}
      />
    </section>
  );
};

export default MainBoardSection;
