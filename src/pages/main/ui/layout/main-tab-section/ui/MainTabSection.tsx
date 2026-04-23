import { Plus } from 'lucide-react';
import type { PostSyncRequest } from '@/entities/post';
import type { MainTab } from '../../main-tabs/model/types';
import LunchSection from '@/widgets/lunch-section';
import PostSection from '@/widgets/post-section';
import RankingSection from '@/widgets/ranking-section';
import RoomSection from '@/widgets/room-section';

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
  LUNCH: '오늘 먹을 수 있는 학식 메뉴를 mock 데이터로 먼저 확인해보세요.',
  RANKING: '좋아요를 많이 받은 인기 학식 메뉴를 둘러보세요.',
  POST: '자유게시판에서 점심메이트와 가볍게 소통해보세요.',
};

const tabTitleMap: Record<MainTab, string> = {
  ROOM: '점심 방 둘러보기',
  LUNCH: '오늘의 학식 메뉴',
  RANKING: '지금 인기 있는 메뉴',
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
  const isRoomTab = activeTab === 'ROOM';
  const isPostTab = activeTab === 'POST';

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
      {activeTab === 'LUNCH' ? <LunchSection /> : null}
      {activeTab === 'RANKING' ? <RankingSection /> : null}
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
