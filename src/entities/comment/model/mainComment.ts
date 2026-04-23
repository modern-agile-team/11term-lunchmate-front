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
