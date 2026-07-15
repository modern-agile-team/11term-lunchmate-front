import client from '@/shared/api/client';
import type { LunchMenuEditorPayload, LunchMenuEditorResult } from './model/lunchMenuEditor.types';

export async function createLunchMenu(
  payload: LunchMenuEditorPayload,
): Promise<LunchMenuEditorResult> {
  const response = await client.post<LunchMenuEditorResult>('/api/v1/lunch-menus', payload);

  return response.data;
}

export async function updateLunchMenu(
  menuId: number,
  payload: LunchMenuEditorPayload,
): Promise<LunchMenuEditorResult> {
  const response = await client.patch<LunchMenuEditorResult>(
    `/api/v1/lunch-menus/${menuId}`,
    payload,
  );

  return response.data;
}