import { cn } from '@/shared/lib/classnames';
import type { MessageTone } from '../model/types';

interface CommentActionMessageProps {
  message: string;
  tone: MessageTone;
}

const CommentActionMessage = ({ message, tone }: CommentActionMessageProps) => (
  <p
    className={cn(
      'mt-4 rounded-2xl border px-4 py-3 text-sm',
      tone === 'error'
        ? 'border-rose-200 bg-rose-50 text-rose-600'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700',
    )}
  >
    {message}
  </p>
);

export default CommentActionMessage;
