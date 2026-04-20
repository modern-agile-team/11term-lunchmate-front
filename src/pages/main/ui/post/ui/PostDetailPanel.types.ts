import type { MainPostComment } from '@/entities/comment';
import type { MainPostDetail } from '@/entities/post';

type MessageTone = 'success' | 'error';

export interface PostDetailPanelProps {
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    data?: unknown;
  };
  canEditSelectedPost: boolean;
  reactionErrorMessage: string;
  handlePostReaction: (type: 'like' | 'dislike') => Promise<void>;
  isLikePostPending: boolean;
  isDislikePostPending: boolean;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
  comments: {
    commentsQuery: {
      isLoading: boolean;
      isError: boolean;
      error: unknown;
    };
    items: MainPostComment[];
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
  };
}
