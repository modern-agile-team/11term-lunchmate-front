import { MessageSquareText } from 'lucide-react';

interface CommentSectionHeaderProps {
  count: number;
}

const CommentSectionHeader = ({ count }: CommentSectionHeaderProps) => (
  <div className="flex items-center gap-2">
    <MessageSquareText className="h-5 w-5 text-indigo-500" />
    <h3 className="text-lg font-semibold text-slate-900">댓글</h3>
    <span className="text-sm text-slate-500">{count}개</span>
  </div>
);

export default CommentSectionHeader;
