import type { ReactNode } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'date';
  placeholder: string;
  trailing?: ReactNode;
  inputClassName?: string;
  registration: Record<string, unknown>;
  error?: string;
}

const AuthField = ({
  id,
  label,
  type,
  placeholder,
  trailing,
  inputClassName = 'h-14',
  registration,
  error,
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
        className={`${inputClassName} w-full rounded-2xl border bg-white px-4 ${trailing ? 'pr-12' : ''} text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
        }`}
        {...registration}
      />
      {trailing ? (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
          {trailing}
        </span>
      ) : null}
    </div>
    {error && <p className="pl-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default AuthField;
