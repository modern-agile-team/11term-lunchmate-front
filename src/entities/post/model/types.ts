export interface PostAuthor {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface PostCategory {
  id: number;
  name: string;
}

export interface PostListItemResponse {
  id: number;
  title: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  user: PostAuthor | null;
  category: PostCategory;
  isMine: boolean;
}

export interface PostDetailResponse extends PostListItemResponse {
  content: string;
  isAnonymous: boolean;
  liked: boolean;
}

export interface GetPostsParams {
  cursor?: number;
  limit?: number;
  categoryId?: number;
}

export interface GetPostsResponse {
  items: PostListItemResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
  isAnonymous: boolean;
}

export type UpdatePostRequest = Partial<CreatePostRequest>;

export interface LikePostResponse {
  postId: number;
  liked: boolean;
  likeCount: number;
}

export interface PostViewCountResponse {
  viewCount: number;
}
