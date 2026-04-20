import CommentSection from '@/pages/main/ui/comment';
import type { MainPostComment } from '@/entities/comment';

type MessageTone = 'success' | 'error';

interface PostCommentBridgeProps {
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

const PostCommentBridge = ({ comments }: PostCommentBridgeProps) => (
  <CommentSection
    comments={comments.items}
    isLoading={comments.commentsQuery.isLoading}
    isError={comments.commentsQuery.isError}
    errorMessage={
      comments.commentsQuery.error instanceof Error
        ? `댓글을 불러오지 못했어요. ${comments.commentsQuery.error.message}`
        : '댓글을 불러오지 못했어요.'
    }
    composer={comments.composer}
    editor={comments.editor}
    reactions={comments.reactions}
  />
);

export default PostCommentBridge;
