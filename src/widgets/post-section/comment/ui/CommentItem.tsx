import type { MainPostComment } from '@/entities/comment';
import type { CommentItemActions, CommentItemState } from '../model/types';
import CommentActionMessage from './CommentActionMessage';
import CommentDeleteConfirm from './CommentDeleteConfirm';
import CommentItemBody from './CommentItemBody';
import CommentItemEditor from './CommentItemEditor';
import CommentItemHeader from './CommentItemHeader';
import CommentItemReactionBar from './CommentItemReactionBar';

interface CommentItemProps {
  comment: MainPostComment;
  state: CommentItemState;
  actions: CommentItemActions;
}

const CommentItem = ({ comment, state, actions }: CommentItemProps) => {
  const itemViewState = {
    isEditing: state.editingCommentId === comment.id,
    isDeleting: state.deletingCommentId === comment.id,
    isLiking: state.likingCommentId === comment.id,
    isDisliking: state.dislikingCommentId === comment.id,
    editingCommentValue: state.editingCommentValue,
    editMessage: state.editMessage,
    editTone: state.editTone,
    deleteMessage: state.deleteMessage,
    deleteTone: state.deleteTone,
  };
  const itemActions = {
    onEditingChange: actions.onEditingChange,
    onEditStart: () => actions.onEditStart(comment),
    onEditCancel: actions.onEditCancel,
    onEditSubmit: () => actions.onEditSubmit(comment),
    onDeleteStart: () => actions.onDeleteStart(comment.id),
    onDeleteCancel: actions.onDeleteCancel,
    onDeleteConfirm: () => actions.onDeleteConfirm(comment),
    onLike: () => actions.onLike(comment),
    onDislike: () => actions.onDislike(comment),
  };

  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <CommentItemHeader
        comment={comment}
        onEditStart={itemActions.onEditStart}
        onDeleteStart={itemActions.onDeleteStart}
      />

      {itemViewState.isEditing ? (
        <CommentItemEditor
          editingCommentValue={itemViewState.editingCommentValue}
          onEditingChange={itemActions.onEditingChange}
          onEditCancel={itemActions.onEditCancel}
          onEditSubmit={itemActions.onEditSubmit}
        />
      ) : (
        <CommentItemBody comment={comment} />
      )}

      {itemViewState.isEditing && itemViewState.editMessage ? (
        <CommentActionMessage message={itemViewState.editMessage} tone={itemViewState.editTone} />
      ) : null}
      {itemViewState.isDeleting && itemViewState.deleteMessage ? (
        <CommentActionMessage
          message={itemViewState.deleteMessage}
          tone={itemViewState.deleteTone}
        />
      ) : null}

      {itemViewState.isDeleting ? (
        <CommentDeleteConfirm
          onCancel={itemActions.onDeleteCancel}
          onConfirm={itemActions.onDeleteConfirm}
        />
      ) : null}

      <CommentItemReactionBar
        comment={comment}
        isLiking={itemViewState.isLiking}
        isDisliking={itemViewState.isDisliking}
        onLike={itemActions.onLike}
        onDislike={itemActions.onDislike}
      />
    </article>
  );
};

export default CommentItem;
