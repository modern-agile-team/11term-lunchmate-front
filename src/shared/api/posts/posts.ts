import client from '@/shared/api/client';

export interface GetPostsParams {
  categoryId?: number;
  page?: number;
  size?: number;
}

export interface PostListUserResponse {
  id?: number;
  nickname?: string;
  name?: string;
}

export interface PostListItemResponse {
  id: number;
  categoryId?: number | null;
  category?: string | null;
  title: string;
  summary?: string | null;
  content?: string | null;
  likeCount?: number | null;
  commentCount?: number | null;
  createdAt: string;
  author?: string | null;
  authorNickname?: string | null;
  userNickname?: string | null;
  nickname?: string | null;
  user?: PostListUserResponse | null;
}

export interface PostListPaginationResponse {
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
  hasNext?: boolean;
}

export interface GetPostsResponse {
  items: PostListItemResponse[];
  pagination?: PostListPaginationResponse;
}

export interface CreatePostRequest {
  categoryId: number;
  title: string;
  content: string;
}

export interface CreatePostResponse {
  id: number;
  userId?: number;
  categoryId?: number | null;
  category?: string | null;
  title: string;
  content: string;
  createdAt: string;
}

export interface UpdatePostRequest {
  categoryId?: number;
  title?: string;
  content?: string;
}

export interface PostDetailResponse {
  id: number;
  userId: number;
  categoryId?: number | null;
  category?: string | null;
  title: string;
  content: string;
  viewCount?: number | null;
  likeCount?: number | null;
  commentCount?: number | null;
  createdAt: string;
}

export async function getPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
  const response = await client.get<GetPostsResponse>('/api/v1/posts', {
    params: {
      categoryId: params.categoryId,
      page: params.page,
      size: params.size,
    },
  });

  return response.data;
}

export async function createPost(payload: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await client.post<CreatePostResponse>('/api/v1/posts', payload);

  return response.data;
}

export async function updatePost(
  postId: number,
  payload: UpdatePostRequest,
): Promise<PostDetailResponse> {
  const response = await client.patch<PostDetailResponse>(`/api/v1/posts/${postId}`, payload);

  return response.data;
}

export async function getPostDetail(postId: number): Promise<PostDetailResponse> {
  const response = await client.get<PostDetailResponse>(`/api/v1/posts/${postId}`);

  return response.data;
}
