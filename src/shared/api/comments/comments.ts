import client from '@/shared/api/client';

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

export async function getComments(
  postId: number,
  params: GetCommentsParams = {},
): Promise<GetCommentsResponse> {
  const response = await client.get<GetCommentsResponse>(`/api/v1/posts/${postId}/comments`, {
    params: {
      page: params.page,
      size: params.size,
    },
  });

  return response.data;
}

export async function createComment(
  postId: number,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> {
  const response = await client.post<CreateCommentResponse>(`/api/v1/posts/${postId}/comments`, payload);

  return response.data;
}

export async function updateComment(
  postId: number,
  commentId: number,
  payload: UpdateCommentRequest,
): Promise<UpdateCommentResponse> {
  const response = await client.patch<UpdateCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}`,
    payload,
  );

  return response.data;
}
