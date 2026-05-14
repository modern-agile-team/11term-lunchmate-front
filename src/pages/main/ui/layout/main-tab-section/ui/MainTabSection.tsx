import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { PostSyncRequest } from '@/entities/post';
import type { MainTab } from '../../main-tabs/model/types';
import LunchSection from '@/widgets/lunch-section';
import PostSection from '@/widgets/post-section';
import RankingSection from '@/widgets/ranking-section';
import RoomSection from '@/widgets/room-section';
import { mockLunchMenus } from '@/widgets/lunch-section/model/mockLunchMenus';
import type { MainLunchMenu } from '@/widgets/lunch-section/model/types';
import type { MainRankingItem } from '@/widgets/ranking-section/model/types';

interface MainTabSectionProps {
  activeTab: MainTab;
  onCreateRoomClick: () => void;
  onCreatePostClick: () => void;
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
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
  onRequireLogin,
}: MainTabSectionProps) => {
  const [lunchMenus, setLunchMenus] = useState<MainLunchMenu[]>(mockLunchMenus);
  const isRoomTab = activeTab === 'ROOM';
  const isPostTab = activeTab === 'POST';

  const rankings = useMemo<MainRankingItem[]>(
    () =>
      [...lunchMenus]
        .sort((a, b) => {
          const scoreDiff = b.likedCount - b.dislikedCount - (a.likedCount - a.dislikedCount);
          if (scoreDiff !== 0) {
            return scoreDiff;
          }

          return b.likedCount - a.likedCount;
        })
        .slice(0, 3)
        .map((menu, index) => ({
          id: menu.id,
          rank: index + 1,
          title: menu.title,
          cafeteriaName: menu.cafeteriaName,
          mealTime: menu.mealTime,
          likedCount: menu.likedCount,
          dislikedCount: menu.dislikedCount,
          score: menu.likedCount - menu.dislikedCount,
          changeText:
            index === 0
              ? '현재 반응 점수 1위 메뉴'
              : `현재 반응 점수 TOP ${index + 1}`,
        })),
    [lunchMenus],
  );

  const handleLike = (menuId: number) => {
    setLunchMenus((currentMenus) =>
      currentMenus.map((menu) => {
        if (menu.id !== menuId) {
          return menu;
        }

        const nextLikedByMe = !menu.likedByMe;
        const removeDislike = Boolean(menu.dislikedByMe && nextLikedByMe);

        return {
          ...menu,
          likedByMe: nextLikedByMe,
          dislikedByMe: removeDislike ? false : menu.dislikedByMe,
          likedCount: Math.max(0, menu.likedCount + (nextLikedByMe ? 1 : -1)),
          dislikedCount: Math.max(0, menu.dislikedCount - (removeDislike ? 1 : 0)),
        };
      }),
    );
  };

  const handleDislike = (menuId: number) => {
    setLunchMenus((currentMenus) =>
      currentMenus.map((menu) => {
        if (menu.id !== menuId) {
          return menu;
        }

        const nextDislikedByMe = !menu.dislikedByMe;
        const removeLike = Boolean(menu.likedByMe && nextDislikedByMe);

        return {
          ...menu,
          dislikedByMe: nextDislikedByMe,
          likedByMe: removeLike ? false : menu.likedByMe,
          dislikedCount: Math.max(0, menu.dislikedCount + (nextDislikedByMe ? 1 : -1)),
          likedCount: Math.max(0, menu.likedCount - (removeLike ? 1 : 0)),
        };
      }),
    );
  };

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">{tabTitleMap[activeTab]}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tabDescriptionMap[activeTab]}</p>
        </div>

        {isRoomTab || isPostTab ? (
          <button
            type="button"
            onClick={isRoomTab ? onCreateRoomClick : onCreatePostClick}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            {isRoomTab ? '방 만들기' : '게시글 작성'}
          </button>
        ) : null}
      </div>

      {activeTab === 'ROOM' ? <RoomSection onRequireLogin={onRequireLogin} /> : null}
      {activeTab === 'LUNCH' ? (
        <LunchSection lunchMenus={lunchMenus} onLike={handleLike} onDislike={handleDislike} />
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
