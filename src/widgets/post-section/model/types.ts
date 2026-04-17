export interface MainPostItem {
  id: number;
  category: 'FREE' | 'REVIEW' | 'INFO' | 'TALK';
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
  category: MainPostItem['category'];
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
  category: MainPostItem['category'];
}

export interface MainPostComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  likedCount: number;
  dislikeCount: number;
  liked: boolean;
  disliked: boolean;
  createdAt: string;
  isMine: boolean;
}
