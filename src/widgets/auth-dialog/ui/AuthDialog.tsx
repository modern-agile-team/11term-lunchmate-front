import { useEffect, useRef } from 'react';
import SignInForm from '@/features/auth/sign-in';
import SignUpForm from '@/features/auth/sign-up';
import { useAuthDialogScreenMode } from '../model/useAuthDialogScreenMode';
import AuthDialogHeader from './AuthDialogHeader';
import AuthDialogTabs from './AuthDialogTabs';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { screenMode, setScreenMode, resetScreenMode } = useAuthDialogScreenMode();

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
      return;
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetScreenMode();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="h-screen max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-slate-950/20"
    >
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AuthDialogHeader onClose={handleClose} />

        <div className="flex flex-1 items-center justify-center px-5 py-12 md:px-8">
          <div className="w-full max-w-[412px]">
            <AuthDialogTabs screenMode={screenMode} />

            {screenMode === 'login' ? (
              <SignInForm
                onSuccess={handleClose}
                onSwitchToSignUp={() => setScreenMode('signup')}
              />
            ) : (
              <SignUpForm
                onSuccess={handleClose}
                onSwitchToSignIn={() => setScreenMode('login')}
              />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AuthDialog;
