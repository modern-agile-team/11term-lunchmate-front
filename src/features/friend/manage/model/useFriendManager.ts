import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  createFriendRequest,
  deleteFriend,
  friendRequestsQueryOptions,
  friendsQueryOptions,
  rejectFriendRequest,
  userSearchQueryOptions,
} from '@/entities/friend';

const SEARCH_DEBOUNCE_MS = 350;

export const useFriendManager = () => {
  const queryClient = useQueryClient();
  const friendsQuery = useQuery(friendsQueryOptions());
  const requestsQuery = useQuery(friendRequestsQueryOptions());
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [keyword]);

  const searchQuery = useQuery(userSearchQueryOptions(debouncedKeyword));

  const refreshFriendData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: friendsQueryOptions().queryKey }),
      queryClient.invalidateQueries({ queryKey: friendRequestsQueryOptions().queryKey }),
      queryClient.invalidateQueries({ queryKey: ['userSearch'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createFriendRequest,
    onSuccess: async () => {
      setFeedback('친구 신청을 보냈어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청을 보내지 못했어요.');
      setFeedbackTone('error');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      setFeedback('친구 신청을 수락했어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청 수락에 실패했어요.');
      setFeedbackTone('error');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      setFeedback('친구 신청을 거절했어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청 거절에 실패했어요.');
      setFeedbackTone('error');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: async () => {
      setFeedback('친구 신청을 취소했어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청 취소에 실패했어요.');
      setFeedbackTone('error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFriend,
    onSuccess: async () => {
      setFeedback('친구를 삭제했어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 삭제에 실패했어요.');
      setFeedbackTone('error');
    },
  });

  const requests = requestsQuery.data?.items ?? [];

  return {
    friends: friendsQuery.data?.items ?? [],
    receivedRequests: requests.filter((item) => item.direction === 'RECEIVED'),
    sentRequests: requests.filter((item) => item.direction === 'SENT'),
    isLoading: friendsQuery.isLoading || requestsQuery.isLoading,
    isError: friendsQuery.isError || requestsQuery.isError,
    keyword,
    handleKeywordChange: setKeyword,
    searchResults: searchQuery.data?.items ?? [],
    isSearching: keyword.trim() !== debouncedKeyword || searchQuery.isFetching,
    feedback,
    feedbackTone,
    isCreatingRequestId: createMutation.isPending ? createMutation.variables?.receiverId : null,
    handleSendRequest: (receiverId: number) => createMutation.mutate({ receiverId }),
    handleAccept: (friendshipId: number) => acceptMutation.mutate(friendshipId),
    handleReject: (friendshipId: number) => rejectMutation.mutate(friendshipId),
    handleCancel: (friendshipId: number) => cancelMutation.mutate(friendshipId),
    handleDeleteFriend: (friendshipId: number) => deleteMutation.mutate(friendshipId),
  };
};
