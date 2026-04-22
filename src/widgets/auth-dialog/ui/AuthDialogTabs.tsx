interface AuthDialogTabsProps {
  screenMode: 'login' | 'signup';
}

const AUTH_DIALOG_COPY = {
  login: {
    title: '다시 만나서 반가워요!',
    description: '로그인하고 점심 메이트를 찾아보세요',
  },
  signup: {
    title: '함께할 준비 되셨나요?',
    description: '간단한 정보만 입력하고 점메추를 시작해보세요',
  },
} as const;

const AuthDialogTabs = ({ screenMode }: AuthDialogTabsProps) => {
  const copy = AUTH_DIALOG_COPY[screenMode];

  return (
    <div className="mb-10 text-center">
      <h2 className="text-[34px] font-extrabold tracking-[-0.04em] text-slate-900">
        {copy.title}
      </h2>
      <p className="mt-3 text-[17px] text-slate-500">{copy.description}</p>
    </div>
  );
};

export default AuthDialogTabs;
