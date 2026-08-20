export interface MainPostComment {
  id: number;
  postId: number;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  isMine: boolean;
}
