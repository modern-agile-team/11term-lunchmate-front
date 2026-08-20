import type {
  CreatePostRequest,
  MainPostDetail,
  PostDetailResponse,
  PostSyncRequest,
} from '@/entities/post';
import type { PostEditorFormValues } from './postEditor.types';

export const toPostEditorPayload = (
  values: Omit<PostEditorFormValues, 'categoryId'> & { categoryId: number },
): CreatePostRequest => ({
  categoryId: values.categoryId,
  title: values.title.trim(),
  content: values.content.trim(),
  isAnonymous: values.isAnonymous,
});

export const toPostEditorFormValues = (post: MainPostDetail): PostEditorFormValues => ({
  categoryId: post.category.id,
  title: post.title,
  content: post.content,
  isAnonymous: post.isAnonymous,
});

export const toPostSyncRequest = (
  post: Pick<PostDetailResponse, 'id' | 'category'>,
): PostSyncRequest => ({
  postId: post.id,
  categoryId: post.category.id,
});
