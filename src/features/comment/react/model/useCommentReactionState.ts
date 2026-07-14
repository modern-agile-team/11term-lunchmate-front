import { useState } from 'react';

type MessageTone = 'success' | 'error';

export const useCommentReactionState = () => {
  const [commentLikeMessage, setCommentLikeMessage] = useState('');
  const [commentLikeTone, setCommentLikeTone] = useState<MessageTone>('success');
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);

  const resetCommentReactionsState = () => {
    setCommentLikeMessage('');
    setCommentLikeTone('success');
    setLikingCommentId(null);
  };

  return {
    commentLikeMessage,
    setCommentLikeMessage,
    commentLikeTone,
    setCommentLikeTone,
    likingCommentId,
    setLikingCommentId,
    resetCommentReactionsState,
  };
};
