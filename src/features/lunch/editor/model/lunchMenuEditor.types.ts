export type LunchMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export const LUNCH_MEAL_TYPE_OPTIONS: Array<{ value: LunchMealType; label: string }> = [
  { value: 'BREAKFAST', label: '아침' },
  { value: 'LUNCH', label: '점심' },
  { value: 'DINNER', label: '저녁' },
];

export interface LunchMenuEditorFormValues {
  mealType: LunchMealType;
  menuName: string;
  price: number;
  calorie: number;
  schoolInfo: string;
  componentsText: string;
}

export interface LunchMenuEditorPayload {
  mealType: LunchMealType;
  menuName: string;
  price: number;
  calorie: number;
  schoolInfo: string;
  components: string[];
}

export interface LunchMenuEditorResult extends LunchMenuEditorPayload {
  id: number;
}

export interface LunchMenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (menu: LunchMenuEditorResult) => void;
  mode?: 'create' | 'edit';
  menuId?: number;
  initialValues?: LunchMenuEditorFormValues;
}

export const INITIAL_LUNCH_MENU_EDITOR_FORM_VALUES: LunchMenuEditorFormValues = {
  mealType: 'LUNCH',
  menuName: '',
  price: 0,
  calorie: 0,
  schoolInfo: '',
  componentsText: '',
};