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
