import client from '@/shared/api/client';
import type { LunchReactionType } from '@/entities/lunch-menu';

export interface LunchMenuReactionResult {
  actionType: LunchReactionType;
  likeCount: number;
  dislikeCount: number;
}

export async function likeLunchMenu(menuId: number): Promise<LunchMenuReactionResult> {
  const response = await client.post<LunchMenuReactionResult>(
    `/api/v1/meal-menus/${menuId}/like`,
  );

  return response.data;
}

export async function dislikeLunchMenu(menuId: number): Promise<LunchMenuReactionResult> {
  const response = await client.post<LunchMenuReactionResult>(
    `/api/v1/meal-menus/${menuId}/dislike`,
  );

  return response.data;
}

export async function cancelLunchMenuReaction(menuId: number): Promise<LunchMenuReactionResult> {
  const response = await client.delete<LunchMenuReactionResult>(
    `/api/v1/meal-menus/${menuId}/reaction`,
  );

  return response.data;
}
