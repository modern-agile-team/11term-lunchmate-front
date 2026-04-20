import type { MainPostCategory, PostSyncRequest } from '@/entities/post';

export interface PostEditorFormValues {
  category: MainPostCategory;
  title: string;
  content: string;
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
  category: 'FREE',
  title: '',
  content: '',
};
