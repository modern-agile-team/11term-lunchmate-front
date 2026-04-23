import {
  formatLunchAt,
  getDetailRoomCurrentCount,
  toDetailRoomStatus,
  toDetailRoomType,
  type RoomDetailResponse,
} from '@/entities/room';

interface DeriveRoomSectionDetailParams {
  roomDetail?: RoomDetailResponse;
}

export const deriveRoomSectionDetail = ({ roomDetail }: DeriveRoomSectionDetailParams) =>
  roomDetail
    ? {
        detailType: toDetailRoomType(roomDetail.roomType),
        detailStatus: toDetailRoomStatus(roomDetail.status),
        formattedLunchAt: formatLunchAt(roomDetail.lunchAt),
        currentCount: getDetailRoomCurrentCount(roomDetail),
      }
    : null;
