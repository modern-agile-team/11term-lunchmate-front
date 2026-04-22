import type { MainPostComment } from '@/entities/comment';

interface CommentItemBodyProps {
  comment: MainPostComment;
}

const CommentItemBody = ({ comment }: CommentItemBodyProps) => (
  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{comment.content}</p>
);

export default CommentItemBody;
