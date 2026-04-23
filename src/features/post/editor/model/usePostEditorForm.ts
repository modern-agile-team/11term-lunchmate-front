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
      category: initialValues?.category ?? INITIAL_POST_EDITOR_FORM_VALUES.category,
      title: initialValues?.title ?? INITIAL_POST_EDITOR_FORM_VALUES.title,
      content: initialValues?.content ?? INITIAL_POST_EDITOR_FORM_VALUES.content,
    }),
    [initialValues?.category, initialValues?.content, initialValues?.title],
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

    setSubmitError('');

    try {
      const submitErrorMessage = await submit.submitPost({
        category: values.category,
        title: trimmedTitle,
        content: trimmedContent,
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
