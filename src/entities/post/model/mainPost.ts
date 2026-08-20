import type { PostCategory } from './types';

export interface MainPostItem {
  id: number;
  title: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  category: PostCategory;
  isMine: boolean;
}

export interface MainPostDetail extends MainPostItem {
  content: string;
  isAnonymous: boolean;
  liked: boolean;
}

export interface PostSyncRequest {
  postId: number;
  categoryId: number;
}
