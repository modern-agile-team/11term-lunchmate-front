import type { CommentListItemResponse } from './types';
import type { MainPostComment } from './mainComment';

export const toMainPostComment = (
  comment: CommentListItemResponse,
  postId: number,
  currentUserId: number | null,
): MainPostComment => ({
  id: comment.id,
  postId: comment.postId ?? postId,
  author:
    comment.author?.trim() ||
    comment.authorNickname?.trim() ||
    comment.userNickname?.trim() ||
    comment.nickname?.trim() ||
    comment.user?.nickname?.trim() ||
    '익명 사용자',
  content: comment.content,
  likedCount: comment.likeCount ?? 0,
  dislikeCount: comment.dislikeCount ?? 0,
  liked: comment.liked ?? false,
  disliked: comment.disliked ?? false,
  createdAt: comment.createdAt,
  isMine:
    typeof comment.isMine === 'boolean'
      ? comment.isMine
      : currentUserId !== null &&
        (comment.userId === currentUserId || comment.authorId === currentUserId),
});
