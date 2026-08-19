import type { LunchMealType } from '@/entities/lunch-menu';

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
  components: string;
}

export interface LunchMenuEditorResult {
  id: number;
  mealType: LunchMealType;
  menuName: string;
  price: number | null;
  calorie: number | null;
  schoolInfo: string;
  components: string[];
  likeCount: number;
  dislikeCount: number;
}

export interface LunchMenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
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