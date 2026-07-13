export interface MainPostComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  likedCount: number;
  liked: boolean;
  createdAt: string;
  isMine: boolean;
}
