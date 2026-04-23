import type { CommentReactionState } from '../model/types';
import CommentActionMessage from './CommentActionMessage';

type CommentReactionMessagesProps = Pick<
  CommentReactionState,
  | 'commentLikeMessage'
  | 'commentLikeTone'
  | 'commentDislikeMessage'
  | 'commentDislikeTone'
>;

const CommentReactionMessages = ({
  commentLikeMessage,
  commentLikeTone,
  commentDislikeMessage,
  commentDislikeTone,
}: CommentReactionMessagesProps) => (
  <>
    {commentLikeMessage ? (
      <CommentActionMessage message={commentLikeMessage} tone={commentLikeTone} />
    ) : null}
    {commentDislikeMessage ? (
      <CommentActionMessage message={commentDislikeMessage} tone={commentDislikeTone} />
    ) : null}
  </>
);

export default CommentReactionMessages;
