import { Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps {
  label: string;
  pendingLabel?: string;
  isPending?: boolean;
}

const AuthSubmitButton = ({ label, pendingLabel, isPending = false }: AuthSubmitButtonProps) => (
  <button
    type="submit"
    disabled={isPending}
    className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 text-base font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-70"
  >
    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
    {isPending ? (pendingLabel ?? label) : label}
  </button>
);

export default AuthSubmitButton;
