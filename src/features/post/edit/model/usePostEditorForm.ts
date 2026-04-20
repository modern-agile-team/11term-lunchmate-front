import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { postQueryKeys } from '@/entities/post';
import { createPost } from '@/features/post/create/api';
import { updatePost } from '@/features/post/edit/api';
import { getPostEditorErrorMessage } from './postEditor.messages';
import { INITIAL_POST_EDITOR_FORM_VALUES, type PostEditorModalProps } from './postEditor.types';
import { toPostEditorPayload, toPostSyncRequest } from './postEditor.mappers';

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
  const queryClient = useQueryClient();
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

  const submitPostMutation = useMutation({
    mutationFn: async (values: typeof defaultFormValues) => {
      const payload = toPostEditorPayload(values);

      if (mode === 'edit') {
        if (!postId) {
          throw new Error('게시글 id가 없어요.');
        }

        return updatePost(postId, payload);
      }

      return createPost(payload);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    postEditorForm.reset(defaultFormValues);
  }, [defaultFormValues, isOpen, postEditorForm]);

  const reset = () => {
    postEditorForm.reset(defaultFormValues);
    setSubmitError('');
    onClose();
  };

  const handleSubmit = postEditorForm.handleSubmit(async (values) => {
    const trimmedTitle = values.title.trim();
    const trimmedContent = values.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setSubmitError('제목과 본문을 입력해주세요.');
      return;
    }

    setSubmitError('');

    try {
      const syncedPost = await submitPostMutation.mutateAsync({
        category: values.category,
        title: trimmedTitle,
        content: trimmedContent,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.details() }),
      ]);

      onSuccess(toPostSyncRequest(syncedPost, values.category));
      reset();
    } catch (error) {
      const errorMessage = getPostEditorErrorMessage(error, mode);
      setSubmitError(errorMessage);

      if (errorMessage.includes('로그인 후')) {
        onRequireLogin();
      }
    }
  });

  return {
    postEditorForm,
    submitError,
    isPending: submitPostMutation.isPending,
    handleSubmit,
    reset,
  };
};
