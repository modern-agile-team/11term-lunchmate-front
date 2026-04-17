export type {
  CreateCommentResponse,
  DislikeCommentResponse,
  LikeCommentResponse,
  UpdateCommentResponse,
} from '@/entities/comment';
export {
  createComment,
  deleteComment,
  dislikeComment,
  likeComment,
  updateComment,
} from './api/commentMutations';
