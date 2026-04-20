import type { RoomDetailResponse } from '@/entities/room';
import type {
  detailRoomStatusStyleMap,
  detailRoomTypeStyleMap,
} from './constants';

interface BuildRoomSectionDetailParams {
  roomDetail?: RoomDetailResponse;
  formatLunchAt: (lunchAt: string) => string;
  getDetailRoomCurrentCount: (roomDetail: RoomDetailResponse) => number;
  toDetailRoomType: (
    roomType: RoomDetailResponse['roomType'],
  ) => keyof typeof detailRoomTypeStyleMap;
  toDetailRoomStatus: (
    status: RoomDetailResponse['status'],
  ) => keyof typeof detailRoomStatusStyleMap;
}

export const buildRoomSectionDetail = ({
  roomDetail,
  formatLunchAt,
  getDetailRoomCurrentCount,
  toDetailRoomType,
  toDetailRoomStatus,
}: BuildRoomSectionDetailParams) =>
  roomDetail
    ? {
        detailType: toDetailRoomType(roomDetail.roomType),
        detailStatus: toDetailRoomStatus(roomDetail.status),
        formattedLunchAt: formatLunchAt(roomDetail.lunchAt),
        currentCount: getDetailRoomCurrentCount(roomDetail),
      }
    : null;
