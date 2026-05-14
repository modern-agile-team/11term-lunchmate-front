export interface FriendSummary {
  id: number;
  name: string;
  nickname: string;
  mbti: string;
  introduce: string;
  profileImageUrl: string;
}

export interface FriendRequestItem {
  id: number;
  fromUserId: number;
  toUserId: number;
  senderNickname: string;
  receiverNickname: string;
  message: string;
  createdAt: string;
  direction: 'INCOMING' | 'OUTGOING';
  status: 'PENDING';
}

export interface GetFriendsResponse {
  items: FriendSummary[];
}

export interface GetFriendRequestsResponse {
  items: FriendRequestItem[];
}

export interface CreateFriendRequestRequest {
  target: string;
  message: string;
}

export type CreateFriendRequestResponse = FriendRequestItem;

export interface RespondFriendRequestRequest {
  accepted: boolean;
}
