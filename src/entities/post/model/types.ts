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
  dislikeCount?: number | null;
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
  liked?: boolean | null;
  disliked?: boolean | null;
  likeCount?: number | null;
  dislikeCount?: number | null;
  commentCount?: number | null;
  createdAt: string;
}

export interface LikePostResponse {
  liked: boolean;
  likeCount: number;
}

export interface DislikePostResponse {
  disliked: boolean;
  dislikeCount: number;
}
