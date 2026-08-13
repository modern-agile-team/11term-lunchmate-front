import client from '@/shared/api/client';
import type {
  CreateFriendRequestRequest,
  CreateFriendRequestResponse,
  GetFriendRequestsResponse,
  GetFriendsResponse,
  RespondFriendRequestResponse,
  SearchUsersResponse,
} from '../model/types';

export async function getFriends(): Promise<GetFriendsResponse> {
  const response = await client.get<GetFriendsResponse>('/api/v1/friends');

  return response.data;
}

export async function getFriendRequests(): Promise<GetFriendRequestsResponse> {
  const response = await client.get<GetFriendRequestsResponse>('/api/v1/friends/requests');

  return response.data;
}

export async function searchUsers(keyword: string): Promise<SearchUsersResponse> {
  const response = await client.get<SearchUsersResponse>('/api/v1/users/search', {
    params: { keyword },
  });

  return response.data;
}

export async function createFriendRequest(
  payload: CreateFriendRequestRequest,
): Promise<CreateFriendRequestResponse> {
  const response = await client.post<CreateFriendRequestResponse>(
    '/api/v1/friends/requests',
    payload,
  );

  return response.data;
}

export async function acceptFriendRequest(
  friendshipId: number,
): Promise<RespondFriendRequestResponse> {
  const response = await client.patch<RespondFriendRequestResponse>(
    `/api/v1/friends/requests/${friendshipId}/accept`,
  );

  return response.data;
}

export async function rejectFriendRequest(
  friendshipId: number,
): Promise<RespondFriendRequestResponse> {
  const response = await client.patch<RespondFriendRequestResponse>(
    `/api/v1/friends/requests/${friendshipId}/reject`,
  );

  return response.data;
}

export async function cancelFriendRequest(friendshipId: number): Promise<void> {
  await client.delete(`/api/v1/friends/requests/${friendshipId}`);
}

export async function deleteFriend(friendshipId: number): Promise<void> {
  await client.delete(`/api/v1/friends/${friendshipId}`);
}
