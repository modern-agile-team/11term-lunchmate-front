import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import {
  lunchMenuQueryKeys,
  patchLunchMenuReaction,
  type LunchReactionType,
  type MainLunchMenu,
} from '@/entities/lunch-menu';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import { cancelLunchMenuReaction, dislikeLunchMenu, likeLunchMenu } from '../api';

interface UseLunchMenuReactionActionParams {
  onRequireLogin: () => void;
}

export const useLunchMenuReactionAction = ({ onRequireLogin }: UseLunchMenuReactionActionParams) => {
  const queryClient = useQueryClient();
  const [reactionErrorMessage, setReactionErrorMessage] = useState('');
  const reactionMutation = useMutation({
    mutationFn: ({ menuId, nextReaction }: { menuId: number; nextReaction: LunchReactionType }) => {
      if (nextReaction === 'LIKE') return likeLunchMenu(menuId);
      if (nextReaction === 'DISLIKE') return dislikeLunchMenu(menuId);
      return cancelLunchMenuReaction(menuId);
    },
  });

  const applyReaction = async (menu: MainLunchMenu, reaction: 'LIKE' | 'DISLIKE') => {
    setReactionErrorMessage('');
    const nextReaction: LunchReactionType = menu.myReaction === reaction ? null : reaction;

    try {
      const result = await reactionMutation.mutateAsync({ menuId: menu.id, nextReaction });

      patchLunchMenuReaction(queryClient, menu.id, {
        myReaction: result.actionType,
        likeCount: result.likeCount,
        dislikeCount: result.dislikeCount,
      });

      await queryClient.invalidateQueries({ queryKey: lunchMenuQueryKeys.rankings('LIKE') });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setReactionErrorMessage('로그인 후 반응을 남길 수 있어요.');
        onRequireLogin();
        return;
      }

      setReactionErrorMessage(getApiMessage(error, '반응을 반영하지 못했어요.'));
    }
  };

  return {
    reactionErrorMessage,
    setReactionErrorMessage,
    handleLike: (menu: MainLunchMenu) => applyReaction(menu, 'LIKE'),
    handleDislike: (menu: MainLunchMenu) => applyReaction(menu, 'DISLIKE'),
    isReactionPending: reactionMutation.isPending,
  };
};
