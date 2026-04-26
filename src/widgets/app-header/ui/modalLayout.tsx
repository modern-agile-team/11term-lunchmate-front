import type { ModalProps } from '@/shared/model/modal';

import { useNavigate } from 'react-router';

//import type { AppHeaderProps } from '@/widgets/app-header/ui/AppHeader';

function AuthDialog({ isOpen, onClose }: ModalProps) {
  //const openModal = () => setIsModalOpen(true);
  const navigate = useNavigate();
  if (!isOpen) return null;
  const closeModal = () => {
    onClose();
  };
  const handleLoginClick = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div>
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex justify-center items-center z-50 transition-all"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative px-12 py-10 bg-[#2c2c2c] rounded-lg shadow-2xl flex flex-col items-center gap-6 min-w-[360px]"
        >
          <button
            onClick={closeModal}
            className="absolute top-2 right-4 text-gray-400 text-3xl hover:text-white"
          >
            x
          </button>

          <div className="text-3xl font-extrabold tracking-tighter bg-gradient-to-b from-indigo-400 to-indigo-700 bg-clip-text text-transparent">
            점심메이트 추천
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button className="w-full py-3.5 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition hover:opacity-90">
              카카오로 로그인
            </button>
            <button className="w-full py-3.5 bg-white text-[#3c4043] rounded-xl font-bold text-sm border border-gray-300 flex justify-center items-center gap-2 transition hover:bg-gray-50">
              구글로 로그인
            </button>
            <button
              onClick={handleLoginClick}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50 w-full"
            >
              로그인/회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthDialog;
