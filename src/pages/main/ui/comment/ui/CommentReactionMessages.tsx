type MessageTone = 'success' | 'error';

interface CommentReactionMessagesProps {
  commentLikeMessage: string;
  commentLikeTone: MessageTone;
  commentDislikeMessage: string;
  commentDislikeTone: MessageTone;
}

const messageClassName = (tone: MessageTone) =>
  tone === 'error'
    ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600'
    : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700';

const CommentReactionMessages = ({
  commentLikeMessage,
  commentLikeTone,
  commentDislikeMessage,
  commentDislikeTone,
}: CommentReactionMessagesProps) => (
  <>
    {commentLikeMessage ? <p className={messageClassName(commentLikeTone)}>{commentLikeMessage}</p> : null}
    {commentDislikeMessage ? (
      <p className={messageClassName(commentDislikeTone)}>{commentDislikeMessage}</p>
    ) : null}
  </>
);

export default CommentReactionMessages;
