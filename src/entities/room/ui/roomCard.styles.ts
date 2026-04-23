export const roomTypeStyleMap = {
  MALE: {
    badgeClassName: 'bg-sky-100 text-sky-700',
    badgeLabel: '남성만',
    cardClassName: 'border-sky-100 bg-sky-50/50',
    progressClassName: 'bg-sky-500',
    buttonClassName:
      'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_10px_24px_rgba(14,165,233,0.2)]',
  },
  FEMALE: {
    badgeClassName: 'bg-rose-100 text-rose-700',
    badgeLabel: '여성만',
    cardClassName: 'border-rose-100 bg-rose-50/50',
    progressClassName: 'bg-rose-500',
    buttonClassName:
      'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_10px_24px_rgba(244,63,94,0.18)]',
  },
  MIXED: {
    badgeClassName: 'bg-indigo-100 text-indigo-700',
    badgeLabel: '혼성',
    cardClassName: 'border-indigo-100 bg-indigo-50/50',
    progressClassName: 'bg-indigo-500',
    buttonClassName:
      'bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_10px_24px_rgba(99,102,241,0.22)]',
  },
} as const;
