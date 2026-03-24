export interface Room {
  id: number;
  title: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  minAge: number;
  maxAge: number;
  currentCount: number;
  capacity: number;
  place: string;
  lunchAt: string;
}

export interface RoomListParams {
  cursor?: number;
  size?: number;
  roomType?: Room['roomType'];
  code?: string;
  minAge?: number;
  maxAge?: number;
  timeFrom?: string;
  timeTo?: string;
}

export interface RoomListResponse {
  items: Room[];
  nextCursor: number | null;
}
