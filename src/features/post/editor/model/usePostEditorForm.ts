import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { INITIAL_POST_EDITOR_FORM_VALUES, type PostEditorModalProps } from './postEditor.types';
import { usePostEditorReset } from './usePostEditorReset';
import { usePostEditorSubmit } from './usePostEditorSubmit';

export const usePostEditorForm = ({
  isOpen,
  mode = 'create',
  postId,
  initialValues,
  onClose,
  onRequireLogin,
  onSuccess,
}: Pick<
  PostEditorModalProps,
  'isOpen' | 'mode' | 'postId' | 'initialValues' | 'onClose' | 'onRequireLogin' | 'onSuccess'
>) => {
  const [submitError, setSubmitError] = useState('');
  const defaultFormValues = useMemo(
    () => ({
      categoryId: initialValues?.categoryId ?? INITIAL_POST_EDITOR_FORM_VALUES.categoryId,
      title: initialValues?.title ?? INITIAL_POST_EDITOR_FORM_VALUES.title,
      content: initialValues?.content ?? INITIAL_POST_EDITOR_FORM_VALUES.content,
      isAnonymous: initialValues?.isAnonymous ?? INITIAL_POST_EDITOR_FORM_VALUES.isAnonymous,
    }),
    [
      initialValues?.categoryId,
      initialValues?.content,
      initialValues?.isAnonymous,
      initialValues?.title,
    ],
  );
  const postEditorForm = useForm({
    defaultValues: defaultFormValues,
  });
  const submit = usePostEditorSubmit({
    mode,
    postId,
    onRequireLogin,
    onSuccess,
  });
  const reset = usePostEditorReset({
    isOpen,
    defaultFormValues,
    postEditorForm,
    setSubmitError,
    onClose,
  });

  const handleSubmit = postEditorForm.handleSubmit(async (values) => {
    const trimmedTitle = values.title.trim();
    const trimmedContent = values.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmitError('제목과 본문을 입력해주세요.');
      return;
    }

    if (values.categoryId === null) {
      setSubmitError('카테고리를 선택해주세요.');
      return;
    }

    setSubmitError('');

    try {
      const submitErrorMessage = await submit.submitPost({
        categoryId: values.categoryId,
        title: trimmedTitle,
        content: trimmedContent,
        isAnonymous: values.isAnonymous,
      });

      if (submitErrorMessage) {
        setSubmitError(submitErrorMessage);
        return;
      }

      reset();
    } catch {
      setSubmitError('게시글 처리 중 알 수 없는 오류가 발생했어요.');
    }
  });

  return {
    postEditorForm,
    submitError,
    isPending: submit.isPending,
    handleSubmit,
    reset,
  };
};
