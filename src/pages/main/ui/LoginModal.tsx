import { useId } from 'react';
import { ArrowLeft, Eye, UsersRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDialog } from '@/shared/lib/useDialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const dialogRef = useDialog({ isOpen, onClose });
  const emailId = useId();
  const passwordId = useId();

  const { register, handleSubmit, reset } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit(() => {
    handleClose();
  });

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
              <h2 className="text-[34px] font-extrabold tracking-[-0.04em] text-slate-900">
                다시 만나서 반가워요!
              </h2>
              <p className="mt-3 text-[17px] text-slate-500">
                로그인하고 점심 메이트를 찾아보세요
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-7"
            >
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label htmlFor={emailId} className="text-sm font-semibold text-slate-900">
                    이메일
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    placeholder="example@university.ac.kr"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    {...register('email')}
                  />
                </div>

                <div className="space-y-2.5">
                  <label htmlFor={passwordId} className="text-sm font-semibold text-slate-900">
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      id={passwordId}
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      {...register('password')}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      <Eye className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 text-base font-semibold text-white transition hover:bg-indigo-600"
              >
                로그인
              </button>

              <p className="mt-5 text-center text-sm text-slate-500">
                아직 계정이 없으신가요?{' '}
                <button type="button" className="font-semibold text-indigo-500 hover:text-indigo-600">
                  회원가입
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default LoginModal;
