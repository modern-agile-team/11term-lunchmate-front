export type MainPostCategory = 'FREE' | 'REVIEW' | 'INFO' | 'TALK';

export interface MainPostItem {
  id: number;
  category: MainPostCategory;
  title: string;
  author: string;
  summary: string;
  content: string;
  likedCount: number;
  commentCount: number;
  createdAt: string;
}

export interface MainPostDetail {
  id: number;
  category: MainPostCategory;
  title: string;
  author: string;
  summary: string;
  content: string;
  likedCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string;
  liked: boolean;
  disliked: boolean;
}

export interface PostSyncRequest {
  postId: number;
  category: MainPostCategory;
}
