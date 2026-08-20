import type { PostSyncRequest } from '@/entities/post';

export interface PostEditorFormValues {
  categoryId: number | null;
  title: string;
  content: string;
  isAnonymous: boolean;
}

export interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequireLogin: () => void;
  onSuccess: (post: PostSyncRequest) => void;
  mode?: 'create' | 'edit';
  postId?: number;
  initialValues?: PostEditorFormValues;
}

export const INITIAL_POST_EDITOR_FORM_VALUES: PostEditorFormValues = {
  categoryId: null,
  title: '',
  content: '',
  isAnonymous: false,
};
