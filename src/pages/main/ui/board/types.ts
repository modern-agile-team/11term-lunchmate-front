export interface MainBoardPost {
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

export interface MainBoardPostSyncRequest {
  postId: number;
  category: MainBoardPost['category'];
}

export interface MainBoardComment {
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
