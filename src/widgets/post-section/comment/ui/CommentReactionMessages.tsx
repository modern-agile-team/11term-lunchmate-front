import type { CommentReactionState } from '../model/types';
import CommentActionMessage from './CommentActionMessage';

type CommentReactionMessagesProps = Pick<
  CommentReactionState,
  'commentLikeMessage' | 'commentLikeTone'
>;

const CommentReactionMessages = ({
  commentLikeMessage,
  commentLikeTone,
}: CommentReactionMessagesProps) => (
  <>
    {commentLikeMessage ? (
      <CommentActionMessage message={commentLikeMessage} tone={commentLikeTone} />
    ) : null}
  </>
);

export default CommentReactionMessages;
