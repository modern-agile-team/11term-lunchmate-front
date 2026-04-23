import type { GetPostsResponse, PostDetailResponse, PostListItemResponse } from './types';
import type { MainPostDetail, MainPostItem } from './mainPost';

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
    switch (post.categoryId) {
      case 1:
        return 'FREE';
      case 2:
        return 'REVIEW';
      case 3:
        return 'INFO';
      case 4:
        return 'TALK';
      default:
        return 'FREE';
    }
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

export const isInfinitePostListData = (
  value: unknown,
): value is { pages: GetPostsResponse[]; pageParams: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  'pages' in value &&
  Array.isArray((value as { pages?: unknown }).pages);
