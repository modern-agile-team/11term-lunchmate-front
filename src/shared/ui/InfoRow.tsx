import type { ReactNode } from 'react';

interface InfoRowProps {
  label: string;
  children: ReactNode;
  align?: 'center' | 'start';
  withBorder?: boolean;
}

const InfoRow = ({ label, children, align = 'center', withBorder = true }: InfoRowProps) => (
  <div
    className={`flex gap-3 py-5 sm:gap-6 ${align === 'start' ? 'items-start' : 'items-center'} ${
      withBorder ? 'border-b border-slate-100' : ''
    }`}
  >
    <span
      className={`w-16 shrink-0 text-sm font-medium text-slate-800 sm:w-24 sm:text-[18px] ${
        align === 'start' ? 'pt-3' : ''
      }`}
    >
      {label}
    </span>
    <div className="flex-1">{children}</div>
  </div>
);

export default InfoRow;
