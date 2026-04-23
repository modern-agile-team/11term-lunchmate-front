interface AuthSubmitButtonProps {
  label: string;
}

const AuthSubmitButton = ({ label }: AuthSubmitButtonProps) => (
  <button
    type="submit"
    className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 text-base font-semibold text-white transition hover:bg-indigo-600"
  >
    {label}
  </button>
);

export default AuthSubmitButton;
