import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { lunchMenuQueryKeys } from '@/entities/lunch-menu';
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
  'isOpen' | 'mode' | 'menuId' | 'initialValues' | 'onClose'
>;

export const useLunchMenuEditorForm = ({
  isOpen,
  mode = 'create',
  menuId,
  initialValues,
  onClose,
}: UseLunchMenuEditorFormParams) => {
  const queryClient = useQueryClient();
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

  const invalidateLunchMenus = () =>
    queryClient.invalidateQueries({ queryKey: lunchMenuQueryKeys.all() });

  const createMutation = useMutation({
    mutationFn: createLunchMenu,
    onSuccess: invalidateLunchMenus,
  });
  const updateMutation = useMutation({
    mutationFn: (payload: LunchMenuEditorPayload) => {
      if (!menuId) {
        throw new Error('메뉴 id가 없어요.');
      }

      return updateLunchMenu(menuId, payload);
    },
    onSuccess: invalidateLunchMenus,
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
        .filter(Boolean)
        .join(' '),
    };

    try {
      if (mode === 'edit') {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

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