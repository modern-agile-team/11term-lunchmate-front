import { useState } from 'react';

type MessageTone = 'success' | 'error';

export const useCommentReactionState = () => {
  const [commentLikeMessage, setCommentLikeMessage] = useState('');
  const [commentLikeTone, setCommentLikeTone] = useState<MessageTone>('success');
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [commentDislikeMessage, setCommentDislikeMessage] = useState('');
  const [commentDislikeTone, setCommentDislikeTone] = useState<MessageTone>('success');
  const [dislikingCommentId, setDislikingCommentId] = useState<number | null>(null);

  const resetCommentReactionsState = () => {
    setCommentLikeMessage('');
    setCommentLikeTone('success');
    setLikingCommentId(null);
    setCommentDislikeMessage('');
    setCommentDislikeTone('success');
    setDislikingCommentId(null);
  };

  return {
    commentLikeMessage,
    setCommentLikeMessage,
    commentLikeTone,
    setCommentLikeTone,
    likingCommentId,
    setLikingCommentId,
    commentDislikeMessage,
    setCommentDislikeMessage,
    commentDislikeTone,
    setCommentDislikeTone,
    dislikingCommentId,
    setDislikingCommentId,
    resetCommentReactionsState,
  };
};
