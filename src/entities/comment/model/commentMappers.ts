import type { CommentDetailResponse } from './types';
import type { MainPostComment } from './mainComment';

export const toMainPostComment = (comment: CommentDetailResponse, postId: number): MainPostComment => ({
  id: comment.id,
  postId,
  authorNickname: comment.user?.nickname ?? '익명',
  authorProfileImageUrl: comment.user?.profileImageUrl ?? null,
  content: comment.content,
  likeCount: comment.likeCount,
  liked: comment.liked,
  createdAt: comment.createdAt,
  isMine: comment.isMine,
});
