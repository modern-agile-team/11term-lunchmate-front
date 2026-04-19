import { Clock3, MapPin, Users } from 'lucide-react';
import type { RoomDetailResponse } from '@/entities/room';
import { cn } from '@/shared/lib/utils';
import {
  detailRoomStatusStyleMap,
  detailRoomTypeStyleMap,
} from '../model/constants';
import RoomMemberModal from './RoomMemberModal';

interface RoomMember {
  userId: number;
  nickname: string;
}

interface RoomMembersQueryState {
  isLoading: boolean;
  isError: boolean;
}

interface RoomDetailQueryState {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: RoomDetailResponse;
}

interface RoomDetailPanelProps {
  detailState: {
    roomDetailQuery: RoomDetailQueryState;
    isHostUser: boolean;
  };
  memberState: {
    roomMembersQuery: RoomMembersQueryState;
    roomMembers: RoomMember[];
    currentUserId: number | null;
  };
  actions: {
    openEditModal: () => void;
    deleteRoom: () => Promise<void>;
    kickMember: (userId: number) => Promise<void>;
  };
  display: {
    detailType: keyof typeof detailRoomTypeStyleMap;
    detailStatus: keyof typeof detailRoomStatusStyleMap;
    formattedLunchAt: string;
    currentCount: number;
  } | null;
}

const RoomDetailPanel = ({
  detailState,
  memberState,
  actions,
  display,
}: RoomDetailPanelProps) => (
  <article className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
    {detailState.roomDetailQuery.isLoading ? (
      <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        방 상세 정보를 불러오는 중...
      </div>
    ) : null}
    {detailState.roomDetailQuery.isError ? (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
        방 상세 정보를 불러오지 못했어요.
        {detailState.roomDetailQuery.error instanceof Error
          ? ` ${detailState.roomDetailQuery.error.message}`
          : ''}
      </div>
    ) : null}
    {detailState.roomDetailQuery.data &&
    display &&
    !detailState.roomDetailQuery.isLoading &&
    !detailState.roomDetailQuery.isError ? (
      <>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  detailRoomTypeStyleMap[display.detailType].badgeClassName,
                )}
              >
                {detailRoomTypeStyleMap[display.detailType].badgeLabel}
              </span>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  detailRoomStatusStyleMap[display.detailStatus].badgeClassName,
                )}
              >
                {detailRoomStatusStyleMap[display.detailStatus].badgeLabel}
              </span>
            </div>
            <h3 className="mt-4 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              {detailState.roomDetailQuery.data.title}
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">
              {detailState.roomDetailQuery.data.description || '방 소개가 아직 없어요.'}
            </p>
          </div>
          {detailState.isHostUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={actions.openEditModal}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => {
                  void actions.deleteRoom();
                }}
                className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                삭제
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4" />
            {display.currentCount}/{detailState.roomDetailQuery.data.maxMembersCount}명
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            {detailState.roomDetailQuery.data.place}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4" />
            {display.formattedLunchAt}
          </div>
        </div>

        <RoomMemberModal
          roomMembersQuery={memberState.roomMembersQuery}
          roomMembers={memberState.roomMembers}
          isHostUser={detailState.isHostUser}
          currentUserId={memberState.currentUserId}
          onKickMember={actions.kickMember}
        />
      </>
    ) : null}
  </article>
);

export default RoomDetailPanel;
