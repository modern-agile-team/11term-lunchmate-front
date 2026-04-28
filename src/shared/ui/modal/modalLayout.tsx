import { useNavigate } from 'react-router';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthDialog({ isOpen, onClose }: ModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex justify-center items-center z-50 transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative px-12 py-10 bg-[#2c2c2c] rounded-lg shadow-2xl flex flex-col items-center gap-7 min-w-[360px]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 text-2xl hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-3xl font-extrabold tracking-tighter bg-gradient-to-b from-indigo-400 to-indigo-700 bg-clip-text text-transparent py-1">
          점심메이트 추천
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button className="h-12 w-full bg-[#FEE500] text-[#191919] rounded-xl font-bold text-[15px] flex justify-center items-center gap-2.5 transition hover:opacity-95 shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 2.5C5.13401 2.5 2 4.8505 2 7.75C2 9.6105 3.28427 11.238 5.22802 12.1865L4.40602 15.1975C4.35902 15.371 4.45977 15.551 4.63077 15.5995C4.69377 15.6175 4.76002 15.6145 4.82102 15.5915L8.51402 13.0675C8.67402 13.0805 8.83602 13.0875 9 13.0875C12.866 13.0875 16 10.737 16 7.8375C16 4.938 12.866 2.5875 9 2.5875V2.5Z"
                fill="#191919"
              />
            </svg>
            카카오로 로그인
          </button>

          <button className="h-12 w-full bg-white text-[#3c4043] rounded-xl font-bold text-[15px] border border-[#dadce0] flex justify-center items-center gap-2.5 transition hover:bg-gray-50 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            구글로 로그인
          </button>

          <button
            onClick={handleLoginClick}
            className="h-12 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white/5 px-4 text-[15px] font-bold text-indigo-400 transition hover:bg-white/10"
          >
            로그인/회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthDialog;
