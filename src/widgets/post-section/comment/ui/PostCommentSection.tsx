import type { MainPostComment } from '@/entities/comment';
import type {
  CommentItemActions,
  CommentItemState,
  CommentListViewState,
  PostCommentSectionState,
} from '../model/types';
import CommentComposer from './CommentComposer';
import CommentList from './CommentList';
import CommentReactionMessages from './CommentReactionMessages';
import CommentSectionHeader from './CommentSectionHeader';

interface PostCommentSectionProps {
  comments: PostCommentSectionState;
}

const PostCommentSection = ({ comments }: PostCommentSectionProps) => {
  const { comments: items, composer, reactions } = comments;
  const viewState: CommentListViewState = {
    isLoading: comments.isLoading,
    isError: comments.isError,
    errorMessage: comments.errorMessage,
  };
  const itemState: CommentItemState = {
    editingCommentId: comments.editor.editingCommentId,
    editingCommentValue: comments.editor.editingCommentValue,
    deletingCommentId: comments.editor.deletingCommentId,
    likingCommentId: comments.reactions.likingCommentId,
    dislikingCommentId: comments.reactions.dislikingCommentId,
    editMessage: comments.editor.editMessage,
    editTone: comments.editor.editTone,
    deleteMessage: comments.editor.deleteMessage,
    deleteTone: comments.editor.deleteTone,
  };
  const itemActions: CommentItemActions = {
    onEditingChange: comments.editor.changeEditValue,
    onEditStart: comments.editor.startEdit,
    onEditCancel: comments.editor.cancelEdit,
    onEditSubmit: (comment: MainPostComment) => {
      void comments.editor.submitEdit(comment);
    },
    onDeleteStart: comments.editor.startDelete,
    onDeleteCancel: comments.editor.cancelDelete,
    onDeleteConfirm: (comment: MainPostComment) => {
      void comments.editor.confirmDelete(comment);
    },
    onLike: (comment: MainPostComment) => {
      void comments.reactions.handleCommentReaction(comment, 'like');
    },
    onDislike: (comment: MainPostComment) => {
      void comments.reactions.handleCommentReaction(comment, 'dislike');
    },
  };

  return (
    <section className="mt-8 space-y-4 border-t border-slate-200 pt-6">
      <CommentSectionHeader count={items.length} />
      <CommentComposer composer={composer} />
      <CommentReactionMessages
        commentLikeMessage={reactions.commentLikeMessage}
        commentLikeTone={reactions.commentLikeTone}
        commentDislikeMessage={reactions.commentDislikeMessage}
        commentDislikeTone={reactions.commentDislikeTone}
      />

      <CommentList
        comments={items}
        viewState={viewState}
        itemState={itemState}
        itemActions={itemActions}
      />
    </section>
  );
};

export default PostCommentSection;
