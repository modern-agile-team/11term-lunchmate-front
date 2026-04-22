import { cn } from '@/shared/lib/classnames';

interface RoomActionBarProps {
  message: string;
  tone: 'success' | 'error';
}

const RoomActionBar = ({ message, tone }: RoomActionBarProps) => {
  if (!message) return null;

  return (
    <section
      className={cn(
        'rounded-[24px] border px-5 py-4 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.05)]',
        tone === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700',
      )}
    >
      {message}
    </section>
  );
};

export default RoomActionBar;
