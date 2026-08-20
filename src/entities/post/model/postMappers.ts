import type { GetPostsResponse, PostDetailResponse, PostListItemResponse } from './types';
import type { MainPostDetail, MainPostItem } from './mainPost';

export const toMainPostItem = (post: PostListItemResponse): MainPostItem => ({
  id: post.id,
  title: post.title,
  createdAt: post.createdAt,
  likeCount: post.likeCount,
  viewCount: post.viewCount,
  commentCount: post.commentCount,
  authorNickname: post.user?.nickname ?? '익명',
  authorProfileImageUrl: post.user?.profileImageUrl ?? null,
  category: post.category,
  isMine: post.isMine,
});

export const toMainPostDetail = (post: PostDetailResponse): MainPostDetail => ({
  ...toMainPostItem(post),
  content: post.content,
  isAnonymous: post.isAnonymous,
  liked: post.liked,
});

export const isInfinitePostListData = (
  value: unknown,
): value is { pages: GetPostsResponse[]; pageParams: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  'pages' in value &&
  Array.isArray((value as { pages?: unknown }).pages);
