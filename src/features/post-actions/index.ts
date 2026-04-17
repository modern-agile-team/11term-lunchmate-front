export type {
  CreatePostResponse,
  DislikePostResponse,
  LikePostResponse,
  PostDetailResponse,
} from '@/entities/post';
export { createPost, deletePost, dislikePost, likePost, updatePost } from './api/postMutations';
