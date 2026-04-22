import type { CreatePostResponse, MainPostCategory, PostDetailResponse, PostSyncRequest } from '@/entities/post';
import { postCategoryIdLabelMap, postCategoryIdMap } from '@/entities/post';
import type { PostEditorFormValues } from './postEditor.types';

export const toPostEditorPayload = (values: PostEditorFormValues) => ({
  categoryId: postCategoryIdMap[values.category],
  title: values.title.trim(),
  content: values.content.trim(),
});

export const toPostEditorFormValues = (
  post: Pick<PostEditorFormValues, 'category' | 'title' | 'content'>,
): PostEditorFormValues => ({
  category: post.category,
  title: post.title,
  content: post.content,
});

export const toPostSyncRequest = (
  post:
    | Pick<CreatePostResponse, 'id' | 'category' | 'categoryId'>
    | Pick<PostDetailResponse, 'id' | 'category' | 'categoryId'>,
  fallbackCategory: MainPostCategory = 'FREE',
): PostSyncRequest => {
  if (
    post.category === 'FREE' ||
    post.category === 'REVIEW' ||
    post.category === 'INFO' ||
    post.category === 'TALK'
  ) {
    return {
      postId: post.id,
      category: post.category,
    };
  }

  return {
    postId: post.id,
    category:
      post.categoryId !== undefined && post.categoryId !== null
        ? (postCategoryIdLabelMap[post.categoryId] as MainPostCategory | undefined) ??
          fallbackCategory
        : fallbackCategory,
  };
};
