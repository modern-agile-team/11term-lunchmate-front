export interface CommentAuthor {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface GetCommentsParams {
  cursor?: number;
  limit?: number;
}

export interface CommentListItemResponse {
  id: number;
  content: string;
  createdAt: string;
  likeCount: number;
  user: CommentAuthor | null;
  liked: boolean;
  isMine: boolean;
}

export type CommentDetailResponse = CommentListItemResponse;

export interface GetCommentsResponse {
  items: CommentListItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface CreateCommentRequest {
  content: string;
  isAnonymous: boolean;
}

export type UpdateCommentRequest = Partial<CreateCommentRequest>;

export type CreateCommentResponse = CommentDetailResponse;
export type UpdateCommentResponse = CommentDetailResponse;

export interface LikeCommentResponse {
  commentId: number;
  liked: boolean;
  likeCount: number;
}
