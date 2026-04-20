import type { MainPostComment } from '@/entities/comment';

type MessageTone = 'success' | 'error';

export interface CommentSectionProps {
  comments: MainPostComment[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  composer: {
    commentInputValue: string;
    setCommentInputValue: (value: string) => void;
    handleCommentSubmit: () => Promise<void>;
    isCommentSubmitPending: boolean;
    commentActionMessage: string;
    commentActionTone: MessageTone;
  };
  editor: {
    editingCommentId: number | null;
    setEditingCommentId: (commentId: number | null) => void;
    editingCommentValue: string;
    setEditingCommentValue: (value: string) => void;
    handleCommentUpdate: (comment: MainPostComment) => Promise<void>;
    commentEditMessage: string;
    setCommentEditMessage: (message: string) => void;
    commentEditTone: MessageTone;
    setCommentEditTone: (tone: MessageTone) => void;
    deletingCommentId: number | null;
    setDeletingCommentId: (commentId: number | null) => void;
    handleCommentDelete: (comment: MainPostComment) => Promise<void>;
    commentDeleteMessage: string;
    setCommentDeleteMessage: (message: string) => void;
    commentDeleteTone: MessageTone;
    setCommentDeleteTone: (tone: MessageTone) => void;
  };
  reactions: {
    handleCommentReaction: (comment: MainPostComment, type: 'like' | 'dislike') => Promise<void>;
    likingCommentId: number | null;
    dislikingCommentId: number | null;
    commentLikeMessage: string;
    commentLikeTone: MessageTone;
    commentDislikeMessage: string;
    commentDislikeTone: MessageTone;
  };
}
