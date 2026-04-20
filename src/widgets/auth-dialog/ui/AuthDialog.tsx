import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, UsersRound } from 'lucide-react';
import SignInForm from '@/features/auth/sign-in';
import SignUpForm from '@/features/auth/sign-up';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [screenMode, setScreenMode] = useState<'login' | 'signup'>('login');

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
    setScreenMode('login');
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="h-screen max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-slate-950/20"
    >
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto flex h-[78px] w-full max-w-6xl items-center gap-4 px-5 md:px-8">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="로그인 창 닫기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]">
                <UsersRound className="h-5 w-5" />
              </div>
              <div className="text-lg font-extrabold tracking-[-0.03em] text-slate-900">
                점메추<span className="text-indigo-500">추</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-12 md:px-8">
          <div className="w-full max-w-[412px]">
            <div className="mb-10 text-center">
              {screenMode === 'login' ? (
                <>
                  <h2 className="text-[34px] font-extrabold tracking-[-0.04em] text-slate-900">
                    다시 만나서 반가워요!
                  </h2>
                  <p className="mt-3 text-[17px] text-slate-500">
                    로그인하고 점심 메이트를 찾아보세요
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-[34px] font-extrabold tracking-[-0.04em] text-slate-900">
                    함께할 준비 되셨나요?
                  </h2>
                  <p className="mt-3 text-[17px] text-slate-500">
                    간단한 정보만 입력하고 점메추를 시작해보세요
                  </p>
                </>
              )}
            </div>

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
