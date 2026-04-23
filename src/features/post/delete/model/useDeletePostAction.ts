import { useMutation, type QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import {
  isInfinitePostListData,
  postQueryKeys,
  type GetPostsResponse,
  type MainPostDetail,
  type MainPostItem,
} from '@/entities/post';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import { deletePost } from '../api';

interface UseDeletePostActionParams {
  selectedPostDetail: MainPostDetail | null;
  postItems: MainPostItem[];
  queryClient: QueryClient;
  onRequireLogin: () => void;
  setSelectedPostId: (postId: number | null) => void;
  closeDeleteConfirm: () => void;
  closeEditModal: () => void;
}

export const useDeletePostAction = ({
  selectedPostDetail,
  postItems,
  queryClient,
  onRequireLogin,
  setSelectedPostId,
  closeDeleteConfirm,
  closeEditModal,
}: UseDeletePostActionParams) => {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const deletePostMutation = useMutation({ mutationFn: deletePost });

  const handleDeletePost = async () => {
    if (!selectedPostDetail) return;

    try {
      await deletePostMutation.mutateAsync(selectedPostDetail.id);
      const nextPost = postItems.find((postItem) => postItem.id !== selectedPostDetail.id);
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
      setDeleteErrorMessage('');
      closeDeleteConfirm();
      closeEditModal();
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

  return {
    deleteErrorMessage,
    setDeleteErrorMessage,
    handleDeletePost,
    isDeletePostPending: deletePostMutation.isPending,
  };
};
