import type { ReactNode } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  trailing?: ReactNode;
  inputClassName?: string;
  registration: Record<string, unknown>;
}

const AuthField = ({
  id,
  label,
  type,
  placeholder,
  trailing,
  inputClassName = 'h-14',
  registration,
}: AuthFieldProps) => (
  <div className="space-y-2.5">
    <label htmlFor={id} className="text-sm font-semibold text-slate-900">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`${inputClassName} w-full rounded-2xl border border-slate-200 bg-white px-4 ${trailing ? 'pr-12' : ''} text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100`}
        {...registration}
      />
      {trailing ? (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
          {trailing}
        </span>
      ) : null}
    </div>
  </div>
);

export default AuthField;
