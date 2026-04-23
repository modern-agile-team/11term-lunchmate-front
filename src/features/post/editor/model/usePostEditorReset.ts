import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  INITIAL_POST_EDITOR_FORM_VALUES,
  type PostEditorFormValues,
  type PostEditorModalProps,
} from './postEditor.types';

interface UsePostEditorResetParams {
  isOpen: boolean;
  defaultFormValues: PostEditorFormValues;
  postEditorForm: UseFormReturn<PostEditorFormValues>;
  setSubmitError: (message: string) => void;
  onClose: PostEditorModalProps['onClose'];
}

export const usePostEditorReset = ({
  isOpen,
  defaultFormValues,
  postEditorForm,
  setSubmitError,
  onClose,
}: UsePostEditorResetParams) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    postEditorForm.reset(defaultFormValues);
  }, [defaultFormValues, isOpen, postEditorForm]);

  return () => {
    postEditorForm.reset(defaultFormValues ?? INITIAL_POST_EDITOR_FORM_VALUES);
    setSubmitError('');
    onClose();
  };
};
