import { getTodayKSTDateString } from './formatKST';

/** 한국식(세는) 나이: 생일과 무관하게 매년 1월 1일에 한 살씩 증가한다. */
export const calculateKoreanAge = (birthDate: string): number => {
  const birthYear = Number(birthDate.slice(0, 4));
  const todayYear = Number(getTodayKSTDateString().slice(0, 4));

  return todayYear - birthYear + 1;
};
