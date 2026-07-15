import type { LunchMealType } from './types';

export const LUNCH_MEAL_TYPE_OPTIONS: Array<{ value: LunchMealType; label: string }> = [
  { value: 'BREAKFAST', label: '아침' },
  { value: 'LUNCH', label: '점심' },
  { value: 'DINNER', label: '저녁' },
];

export const lunchMealTypeLabelMap: Record<LunchMealType, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
};