export interface GetCommentsParams {
  page?: number;
  size?: number;
}

export interface CommentListUserResponse {
  id?: number;
  nickname?: string;
  name?: string;
}

export interface CommentListItemResponse {
  id: number;
  postId?: number | null;
  userId?: number | null;
  authorId?: number | null;
  content: string;
  likeCount?: number | null;
  dislikeCount?: number | null;
  liked?: boolean | null;
  disliked?: boolean | null;
  createdAt: string;
  author?: string | null;
  authorNickname?: string | null;
  userNickname?: string | null;
  nickname?: string | null;
  isMine?: boolean | null;
  user?: CommentListUserResponse | null;
}

export interface CommentListPaginationResponse {
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
  hasNext?: boolean;
}

export interface GetCommentsResponse {
  items: CommentListItemResponse[];
  pagination?: CommentListPaginationResponse;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponse extends CommentListItemResponse {
  postId: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse extends CommentListItemResponse {
  postId: number;
}

export interface LikeCommentResponse {
  liked: boolean;
  likeCount: number;
}

export interface DislikeCommentResponse {
  disliked: boolean;
  dislikeCount: number;
}
