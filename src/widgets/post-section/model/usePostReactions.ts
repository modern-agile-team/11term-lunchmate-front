import { type QueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { postQueryKeys, type GetPostsResponse, type PostDetailResponse } from '@/entities/post';
import { deletePost, dislikePost, likePost } from '@/features/post-actions';
import { getApiMessage, isInfinitePostListData } from './helpers';
import type { MainPostDetail, MainPostItem, PostSyncRequest } from './types';

interface UsePostReactionsParams {
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: { data: PostDetailResponse | undefined };
  postItems: MainPostItem[];
  queryClient: QueryClient;
  onRequireLogin: () => void;
  setSelectedPostId: (postId: number | null) => void;
}

export const usePostReactions = ({
  selectedPostDetail,
  postDetailQuery,
  postItems,
  queryClient,
  onRequireLogin,
  setSelectedPostId,
}: UsePostReactionsParams) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const [reactionErrorMessage, setReactionErrorMessage] = useState('');

  const likePostMutation = useMutation({ mutationFn: likePost });
  const dislikePostMutation = useMutation({ mutationFn: dislikePost });
  const deletePostMutation = useMutation({ mutationFn: deletePost });

  const invalidatePostCaches = async (postId: number) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) }),
    ]);

  const handlePostReaction = async (type: 'like' | 'dislike') => {
    if (!postDetailQuery.data) return;
    setReactionErrorMessage('');

    try {
      if (type === 'like') {
        await likePostMutation.mutateAsync(postDetailQuery.data.id);
      } else {
        await dislikePostMutation.mutateAsync(postDetailQuery.data.id);
      }
      await invalidatePostCaches(postDetailQuery.data.id);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setReactionErrorMessage(
          type === 'like'
            ? '로그인 후 게시글을 좋아요할 수 있어요.'
            : '로그인 후 게시글을 싫어요할 수 있어요.',
        );
        onRequireLogin();
        return;
      }
      setReactionErrorMessage(
        getApiMessage(
          error,
          type === 'like' ? '좋아요를 반영하지 못했어요.' : '싫어요를 반영하지 못했어요.',
        ),
      );
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPostDetail) return;

    try {
      await deletePostMutation.mutateAsync(selectedPostDetail.id);
      const nextPost = postItems.find(
        (postItem) => postItem.id !== selectedPostDetail.id,
      );
      queryClient.setQueriesData({ queryKey: postQueryKeys.lists() }, (currentData: unknown) => {
        if (!isInfinitePostListData(currentData)) return currentData;
        return {
          ...currentData,
          pages: currentData.pages.map((page: GetPostsResponse) => ({
            ...page,
            items: page.items.filter((item) => item.id !== selectedPostDetail.id),
          })),
        };
      });
      setIsDeleteConfirmModalOpen(false);
      setIsEditPostModalOpen(false);
      setSelectedPostId(nextPost?.id ?? null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.details() }),
      ]);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setDeleteErrorMessage('로그인 후 게시글을 삭제할 수 있어요.');
        onRequireLogin();
        return;
      }
      setDeleteErrorMessage(getApiMessage(error, '게시글을 삭제하지 못했어요.'));
    }
  };

  const handleEditPostSuccess = (syncedPost: PostSyncRequest) => {
    setSelectedPostId(syncedPost.postId);
    setIsEditPostModalOpen(false);
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(syncedPost.postId) }),
    ]);
  };

  return {
    isEditPostModalOpen,
    setIsEditPostModalOpen,
    isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen,
    deleteErrorMessage,
    reactionErrorMessage,
    handlePostReaction,
    handleDeletePost,
    handleEditPostSuccess,
    isLikePostPending: likePostMutation.isPending,
    isDislikePostPending: dislikePostMutation.isPending,
    isDeletePostPending: deletePostMutation.isPending,
    invalidatePostCaches,
  };
};
