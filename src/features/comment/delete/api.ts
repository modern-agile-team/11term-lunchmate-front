import client from '@/shared/api/client';

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  await client.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
}
