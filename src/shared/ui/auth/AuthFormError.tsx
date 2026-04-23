interface AuthFormErrorProps {
  message: string;
}

const AuthFormError = ({ message }: AuthFormErrorProps) =>
  message ? <p className="mt-4 text-sm text-rose-500">{message}</p> : null;

export default AuthFormError;
