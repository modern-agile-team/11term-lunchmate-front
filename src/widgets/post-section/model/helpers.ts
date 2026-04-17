import { isAxiosError } from 'axios';
import type { CommentListItemResponse } from '@/entities/comment';
import type { GetPostsResponse, PostDetailResponse, PostListItemResponse } from '@/entities/post';
import type { ApiErrorPayload } from '@/shared/types/api';
import { postCategoryIdLabelMap } from './constants';
import type { MainPostComment, MainPostDetail, MainPostItem } from './types';

export const POST_LIST_DEFAULT_PAGE = 1;
export const POST_LIST_DEFAULT_SIZE = 10;
export const COMMENTS_LIST_DEFAULT_PAGE = 1;
export const COMMENTS_LIST_DEFAULT_SIZE = 10;

export const formatRelativeCreatedAt = (createdAt: string) => {
  const currentTime = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor((currentTime - createdTime) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${Math.floor(diffHours / 24)}일 전`;
};

export const getApiMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return fallbackMessage;
};

export const toPostCategory = (
  post:
    | Pick<PostListItemResponse, 'category' | 'categoryId'>
    | Pick<PostDetailResponse, 'category' | 'categoryId'>,
): MainPostItem['category'] => {
  if (
    post.category === 'FREE' ||
    post.category === 'REVIEW' ||
    post.category === 'INFO' ||
    post.category === 'TALK'
  ) {
    return post.category;
  }

  if (post.categoryId !== undefined && post.categoryId !== null) {
    return postCategoryIdLabelMap[post.categoryId] ?? 'FREE';
  }

  return 'FREE';
};

export const toPostAuthor = (post: PostListItemResponse) =>
  post.author?.trim() ||
  post.authorNickname?.trim() ||
  post.userNickname?.trim() ||
  post.nickname?.trim() ||
  post.user?.nickname?.trim() ||
  post.user?.name?.trim() ||
  '익명 사용자';

export const toPostSummary = (post: PostListItemResponse) => {
  const sourceText = post.summary?.trim() || post.content?.trim() || '';

  if (sourceText === '') {
    return '게시글 요약이 아직 없어요.';
  }

  return sourceText.length <= 90 ? sourceText : `${sourceText.slice(0, 90).trimEnd()}...`;
};

export const toMainPostItem = (post: PostListItemResponse): MainPostItem => ({
  id: post.id,
  category: toPostCategory(post),
  title: post.title,
  author: toPostAuthor(post),
  summary: toPostSummary(post),
  content: post.content ?? '',
  likedCount: post.likeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
});

export const toMainPostDetail = (post: PostDetailResponse, author: string): MainPostDetail => ({
  id: post.id,
  category: toPostCategory(post),
  title: post.title,
  author,
  summary: post.content,
  content: post.content,
  likedCount: post.likeCount ?? 0,
  dislikeCount: post.dislikeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
  liked: post.liked ?? false,
  disliked: post.disliked ?? false,
});

export const toMainPostComment = (
  comment: CommentListItemResponse,
  postId: number,
  currentUserId: number | null,
): MainPostComment => ({
  id: comment.id,
  postId: comment.postId ?? postId,
  author:
    comment.author?.trim() ||
    comment.authorNickname?.trim() ||
    comment.userNickname?.trim() ||
    comment.nickname?.trim() ||
    comment.user?.nickname?.trim() ||
    '익명 사용자',
  content: comment.content,
  likedCount: comment.likeCount ?? 0,
  dislikeCount: comment.dislikeCount ?? 0,
  liked: comment.liked ?? false,
  disliked: comment.disliked ?? false,
  createdAt: comment.createdAt,
  isMine:
    typeof comment.isMine === 'boolean'
      ? comment.isMine
      : currentUserId !== null &&
        (comment.userId === currentUserId || comment.authorId === currentUserId),
});

export const toEditPostFormValues = (post: MainPostItem) => ({
  category: post.category,
  title: post.title,
  content: post.content,
});

export const isInfinitePostListData = (
  value: unknown,
): value is { pages: GetPostsResponse[]; pageParams: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  'pages' in value &&
  Array.isArray((value as { pages?: unknown }).pages);
