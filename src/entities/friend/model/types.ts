import type { PublicUser } from '@/entities/user';

export type RelationshipStatus =
  | 'NONE'
  | 'PENDING_SENT'
  | 'PENDING_RECEIVED'
  | 'ACCEPTED'
  | 'REJECTED';

export interface UserSearchResultItem {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  schoolInfo: string | null;
  relationshipStatus: RelationshipStatus;
}

export interface SearchUsersResponse {
  items: UserSearchResultItem[];
}

export interface FriendSummary {
  friendshipId: number;
  status: 'ACCEPTED';
  user: PublicUser;
}

export interface GetFriendsResponse {
  items: FriendSummary[];
}

export type FriendRequestDirection = 'SENT' | 'RECEIVED';

export interface FriendRequestItem {
  friendshipId: number;
  requesterId: number;
  receiverId: number;
  direction: FriendRequestDirection;
  user: PublicUser;
  createdAt: string;
}

export interface GetFriendRequestsResponse {
  items: FriendRequestItem[];
}

export interface CreateFriendRequestRequest {
  receiverId: number;
}

export interface CreateFriendRequestResponse {
  id: number;
  requesterId: number;
  receiverId: number;
  status: 'PENDING';
  createdAt: string;
}

export interface RespondFriendRequestResponse {
  id: number;
  requesterId: number;
  receiverId: number;
  status: 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
