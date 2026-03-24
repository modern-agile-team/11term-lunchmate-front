export type RoomType = 'MIXED' | 'FEMALE' | 'MALE';

export interface Room {
  id: number;
  title: string;
  roomType: RoomType;
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
  roomType?: RoomType;
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
