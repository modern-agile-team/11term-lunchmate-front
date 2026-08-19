import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import type { PostSyncRequest } from '@/entities/post';
import { myRoomQueryOptions, type RoomSyncRequest } from '@/entities/room';
import { myUserQueryOptions } from '@/entities/user';
import { lunchMenuListQueryOptions, lunchMenuRankingsQueryOptions } from '@/entities/lunch-menu';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';
import type { MainTab } from '../../main-tabs/model/types';
import LunchSection from '@/widgets/lunch-section';
import PostSection from '@/widgets/post-section';
import RankingSection from '@/widgets/ranking-section';
import RoomSection from '@/widgets/room-section';
import type { MainRankingItem } from '@/widgets/ranking-section/model/types';

interface MainTabSectionProps {
  activeTab: MainTab;
  onCreateRoomClick: () => void;
  onCreatePostClick: () => void;
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
  roomSyncRequest: RoomSyncRequest | null;
  onRoomSyncHandled: () => void;
  onRequireLogin: () => void;
}

const tabDescriptionMap: Record<MainTab, string> = {
  ROOM: '현재 열려 있는 점심 방을 둘러보고, 바로 참여할 수 있어요.',
  LUNCH: '오늘 학식 메뉴를 조회하고, 메뉴별 좋아요와 싫어요 반응을 남겨보세요.',
  RANKING: '학식 메뉴에 쌓인 좋아요와 싫어요를 바탕으로 실시간 랭킹을 보여줍니다.',
  POST: '자유게시판에서 점심메이트와 가볍게 소통해보세요.',
};

const tabTitleMap: Record<MainTab, string> = {
  ROOM: '점심 방 둘러보기',
  LUNCH: '오늘의 학식 메뉴 조회',
  RANKING: '실시간 학식 랭킹',
  POST: '자유게시판',
};

const MainTabSection = ({
  activeTab,
  onCreateRoomClick,
  onCreatePostClick,
  postSyncRequest,
  onPostSyncHandled,
  roomSyncRequest,
  onRoomSyncHandled,
  onRequireLogin,
}: MainTabSectionProps) => {
  const isRoomTab = activeTab === 'ROOM';
  const isPostTab = activeTab === 'POST';
  const myUserQuery = useQuery(myUserQueryOptions());
  const isAdmin = myUserQuery.data?.role === 'ADMIN';
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);
  const myRoomQuery = useQuery({ ...myRoomQueryOptions(), enabled: isAuthed });
  const hasJoinedRoom = myRoomQuery.isSuccess;
  const isCreateRoomDisabled = isRoomTab && (!isAuthed || hasJoinedRoom);
  const lunchMenusQuery = useQuery(lunchMenuListQueryOptions());
  const lunchMenus = useMemo(() => lunchMenusQuery.data ?? [], [lunchMenusQuery.data]);

  const lunchRankingsQuery = useQuery({
    ...lunchMenuRankingsQueryOptions('LIKE'),
    enabled: activeTab === 'RANKING',
  });
  const rankings = useMemo<MainRankingItem[]>(
    () =>
      (lunchRankingsQuery.data ?? []).map((menu, index) => ({
        id: menu.id,
        rank: index + 1,
        menuName: menu.menuName,
        mealType: menu.mealType,
        schoolInfo: menu.schoolInfo,
        likeCount: menu.likeCount,
        dislikeCount: menu.dislikeCount,
      })),
    [lunchRankingsQuery.data],
  );

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">
            {tabTitleMap[activeTab]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tabDescriptionMap[activeTab]}</p>
        </div>

        {isRoomTab || isPostTab ? (
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={isRoomTab ? onCreateRoomClick : onCreatePostClick}
              disabled={isCreateRoomDisabled}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
            >
              <Plus className="h-4 w-4" />
              {isRoomTab ? '방 만들기' : '게시글 작성'}
            </button>
            {isCreateRoomDisabled ? (
              <p className="text-xs text-slate-400">
                {!isAuthed ? '로그인 후 이용할 수 있어요.' : '이미 참여중인 방이 있어요.'}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {activeTab === 'ROOM' ? (
        <RoomSection
          onRequireLogin={onRequireLogin}
          roomSyncRequest={roomSyncRequest}
          onRoomSyncHandled={onRoomSyncHandled}
        />
      ) : null}
      {activeTab === 'LUNCH' ? (
        <LunchSection lunchMenus={lunchMenus} isAdmin={isAdmin} onRequireLogin={onRequireLogin} />
      ) : null}
      {activeTab === 'RANKING' ? <RankingSection rankings={rankings} /> : null}
      {activeTab === 'POST' ? (
        <PostSection
          postSyncRequest={postSyncRequest}
          onPostSyncHandled={onPostSyncHandled}
          onRequireLogin={onRequireLogin}
        />
      ) : null}
    </section>
  );
};

export default MainTabSection;