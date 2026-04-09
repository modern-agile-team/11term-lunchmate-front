export interface MainRoom {
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
