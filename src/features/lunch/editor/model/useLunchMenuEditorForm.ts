import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createLunchMenu, updateLunchMenu } from '../api';
import { getLunchMenuEditorErrorMessage } from './lunchMenuEditor.messages';
import {
  INITIAL_LUNCH_MENU_EDITOR_FORM_VALUES,
  type LunchMenuEditorFormValues,
  type LunchMenuEditorModalProps,
  type LunchMenuEditorPayload,
} from './lunchMenuEditor.types';

type UseLunchMenuEditorFormParams = Pick<
  LunchMenuEditorModalProps,
  'isOpen' | 'mode' | 'menuId' | 'initialValues' | 'onClose' | 'onSuccess'
>;

export const useLunchMenuEditorForm = ({
  isOpen,
  mode = 'create',
  menuId,
  initialValues,
  onClose,
  onSuccess,
}: UseLunchMenuEditorFormParams) => {
  const [submitError, setSubmitError] = useState('');
  const form = useForm<LunchMenuEditorFormValues>({
    defaultValues: initialValues ?? INITIAL_LUNCH_MENU_EDITOR_FORM_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset(initialValues ?? INITIAL_LUNCH_MENU_EDITOR_FORM_VALUES);
  }, [isOpen]);

  const createMutation = useMutation({ mutationFn: createLunchMenu });
  const updateMutation = useMutation({
    mutationFn: (payload: LunchMenuEditorPayload) => {
      if (!menuId) {
        throw new Error('메뉴 id가 없어요.');
      }

      return updateLunchMenu(menuId, payload);
    },
  });
  const isPending = createMutation.isPending || updateMutation.isPending;

  const reset = () => {
    form.reset(INITIAL_LUNCH_MENU_EDITOR_FORM_VALUES);
    setSubmitError('');
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const trimmedMenuName = values.menuName.trim();
    const trimmedSchoolInfo = values.schoolInfo.trim();

    if (!trimmedMenuName || !trimmedSchoolInfo) {
      setSubmitError('필수 항목을 입력해 주세요.');
      return;
    }

    setSubmitError('');

    const payload: LunchMenuEditorPayload = {
      mealType: values.mealType,
      menuName: trimmedMenuName,
      price: values.price,
      calorie: values.calorie,
      schoolInfo: trimmedSchoolInfo,
      components: values.componentsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const result =
        mode === 'edit'
          ? await updateMutation.mutateAsync(payload)
          : await createMutation.mutateAsync(payload);

      onSuccess(result);
      reset();
    } catch (error) {
      setSubmitError(getLunchMenuEditorErrorMessage(error, mode));
    }
  });

  return {
    form,
    submitError,
    isPending,
    handleSubmit,
    reset,
  };
};
