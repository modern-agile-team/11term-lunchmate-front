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
  const isEditing = state.editingCommentId === comment.id;
  const isDeleting = state.deletingCommentId === comment.id;
  const isLiking = state.likingCommentId === comment.id;
  const isDisliking = state.dislikingCommentId === comment.id;

  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <CommentItemHeader
        comment={comment}
        onEditStart={actions.onEditStart}
        onDeleteStart={actions.onDeleteStart}
      />

      {isEditing ? (
        <CommentItemEditor
          comment={comment}
          editingCommentValue={state.editingCommentValue}
          onEditingChange={actions.onEditingChange}
          onEditCancel={actions.onEditCancel}
          onEditSubmit={actions.onEditSubmit}
        />
      ) : (
        <CommentItemBody comment={comment} />
      )}

      {isEditing && state.editMessage ? (
        <CommentActionMessage message={state.editMessage} tone={state.editTone} />
      ) : null}
      {isDeleting && state.deleteMessage ? (
        <CommentActionMessage message={state.deleteMessage} tone={state.deleteTone} />
      ) : null}

      {isDeleting ? (
        <CommentDeleteConfirm
          onCancel={actions.onDeleteCancel}
          onConfirm={() => actions.onDeleteConfirm(comment)}
        />
      ) : null}

      <CommentItemReactionBar
        comment={comment}
        isLiking={isLiking}
        isDisliking={isDisliking}
        onLike={actions.onLike}
        onDislike={actions.onDislike}
      />
    </article>
  );
};

export default CommentItem;
