import type { MainPostComment } from '@/entities/comment';
import CommentComposer from './CommentComposer';
import CommentList from './CommentList';
import CommentReactionMessages from './CommentReactionMessages';
import CommentSectionHeader from './CommentSectionHeader';
import type { CommentSectionProps } from './CommentSection.types';

const CommentSection = ({
  comments,
  isLoading,
  isError,
  errorMessage,
  composer,
  editor,
  reactions,
}: CommentSectionProps) => {
  const handleEditStart = (comment: MainPostComment) => {
    editor.setDeletingCommentId(null);
    editor.setCommentDeleteMessage('');
    editor.setCommentEditMessage('');
    editor.setEditingCommentId(comment.id);
    editor.setEditingCommentValue(comment.content);
  };

  const handleEditCancel = () => {
    editor.setEditingCommentId(null);
    editor.setEditingCommentValue('');
    editor.setCommentEditMessage('');
    editor.setCommentEditTone('success');
  };

  const handleDeleteStart = (commentId: number) => {
    editor.setEditingCommentId(null);
    editor.setEditingCommentValue('');
    editor.setCommentEditMessage('');
    editor.setDeletingCommentId(commentId);
    editor.setCommentDeleteMessage('');
  };

  const handleDeleteCancel = () => {
    editor.setDeletingCommentId(null);
    editor.setCommentDeleteMessage('');
    editor.setCommentDeleteTone('success');
  };

  return (
    <section className="mt-8 space-y-4 border-t border-slate-200 pt-6">
      <CommentSectionHeader count={comments.length} />
      <CommentComposer composer={composer} />
      <CommentReactionMessages
        commentLikeMessage={reactions.commentLikeMessage}
        commentLikeTone={reactions.commentLikeTone}
        commentDislikeMessage={reactions.commentDislikeMessage}
        commentDislikeTone={reactions.commentDislikeTone}
      />

      <CommentList
        comments={comments}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        editingCommentId={editor.editingCommentId}
        editingCommentValue={editor.editingCommentValue}
        onEditingChange={editor.setEditingCommentValue}
        onEditStart={handleEditStart}
        onEditCancel={handleEditCancel}
        onEditSubmit={(comment) => {
          void editor.handleCommentUpdate(comment);
        }}
        editMessage={editor.commentEditMessage}
        editTone={editor.commentEditTone}
        deletingCommentId={editor.deletingCommentId}
        onDeleteStart={handleDeleteStart}
        onDeleteCancel={handleDeleteCancel}
        onDeleteConfirm={(comment) => {
          void editor.handleCommentDelete(comment);
        }}
        deleteMessage={editor.commentDeleteMessage}
        deleteTone={editor.commentDeleteTone}
        onLike={(comment) => {
          void reactions.handleCommentReaction(comment, 'like');
        }}
        onDislike={(comment) => {
          void reactions.handleCommentReaction(comment, 'dislike');
        }}
        likingCommentId={reactions.likingCommentId}
        dislikingCommentId={reactions.dislikingCommentId}
      />
    </section>
  );
};

export default CommentSection;
