import client from '@/shared/api/client';
import type {
  CreateFriendRequestRequest,
  CreateFriendRequestResponse,
  GetFriendRequestsResponse,
  GetFriendsResponse,
  RespondFriendRequestRequest,
} from '../model/types';

export async function getFriends(): Promise<GetFriendsResponse> {
  const response = await client.get<GetFriendsResponse>('/api/v1/friends');

  return response.data;
}

export async function getFriendRequests(): Promise<GetFriendRequestsResponse> {
  const response = await client.get<GetFriendRequestsResponse>('/api/v1/friends/requests');

  return response.data;
}

export async function createFriendRequest(
  payload: CreateFriendRequestRequest,
): Promise<CreateFriendRequestResponse> {
  const response = await client.post<CreateFriendRequestResponse>('/api/v1/friends/requests', payload);

  return response.data;
}

export async function respondFriendRequest(
  requestId: number,
  payload: RespondFriendRequestRequest,
): Promise<void> {
  await client.patch(`/api/v1/friends/requests/${requestId}`, payload);
}

export async function cancelFriendRequest(requestId: number): Promise<void> {
  await client.delete(`/api/v1/friends/requests/${requestId}`);
}

export async function deleteFriend(friendId: number): Promise<void> {
  await client.delete(`/api/v1/friends/${friendId}`);
}
