import client from '@/shared/api/client';

export async function deleteLunchMenu(menuId: number): Promise<void> {
  await client.delete(`/api/v1/lunch-menus/${menuId}`);
}