import { UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import SocialSignUpForm from '@/features/auth/sign-up-social';

const SocialSignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center gap-8">
        <section className="w-full max-w-md text-slate-900">
          <div className="inline-flex items-center gap-3 rounded-full border border-indigo-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur">
            <UsersRound className="h-4 w-4" />
            추가 정보 입력
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-slate-900">
            가입을 완료하고
            <br />
            점심메이트를 찾아보세요.
          </h1>
        </section>
        <div className="w-full max-w-md">
          <SocialSignUpForm onSuccess={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default SocialSignUpPage;
