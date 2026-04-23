import client from '@/shared/api/client';

export async function deletePost(postId: number): Promise<void> {
  await client.delete(`/api/v1/posts/${postId}`);
}
