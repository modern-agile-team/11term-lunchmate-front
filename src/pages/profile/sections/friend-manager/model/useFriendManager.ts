import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelFriendRequest,
  createFriendRequest,
  deleteFriend,
  friendRequestsQueryOptions,
  friendsQueryOptions,
  respondFriendRequest,
} from '@/entities/friend';

export const useFriendManager = () => {
  const queryClient = useQueryClient();
  const friendsQuery = useQuery(friendsQueryOptions());
  const requestsQuery = useQuery(friendRequestsQueryOptions());
  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success');

  const refreshFriendData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: friendsQueryOptions().queryKey }),
      queryClient.invalidateQueries({ queryKey: friendRequestsQueryOptions().queryKey }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createFriendRequest,
    onSuccess: async () => {
      setTarget('');
      setMessage('');
      setFeedback('친구 신청을 보냈어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청을 보내지 못했어요.');
      setFeedbackTone('error');
    },
  });

  const respondMutation = useMutation({
    mutationFn: ({ requestId, accepted }: { requestId: number; accepted: boolean }) =>
      respondFriendRequest(requestId, { accepted }),
    onSuccess: async (_, variables) => {
      setFeedback(variables.accepted ? '친구 신청을 수락했어요.' : '친구 신청을 거절했어요.');
      setFeedbackTone('success');
      await refreshFriendData();
    },
    onError: () => {
      setFeedback('친구 신청 처리에 실패했어요.');
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

  const handleSubmitRequest = () => {
    if (!target.trim()) {
      setFeedback('닉네임 또는 이메일을 입력해 주세요.');
      setFeedbackTone('error');
      return;
    }

    createMutation.mutate({
      target: target.trim(),
      message: message.trim(),
    });
  };

  return {
    friends: friendsQuery.data?.items ?? [],
    requests: requestsQuery.data?.items ?? [],
    isLoading: friendsQuery.isLoading || requestsQuery.isLoading,
    isError: friendsQuery.isError || requestsQuery.isError,
    target,
    message,
    feedback,
    feedbackTone,
    isCreating: createMutation.isPending,
    handleTargetChange: setTarget,
    handleMessageChange: setMessage,
    handleSubmitRequest,
    handleAccept: (requestId: number) => respondMutation.mutate({ requestId, accepted: true }),
    handleReject: (requestId: number) => respondMutation.mutate({ requestId, accepted: false }),
    handleCancel: (requestId: number) => cancelMutation.mutate(requestId),
    handleDeleteFriend: (friendId: number) => deleteMutation.mutate(friendId),
  };
};
