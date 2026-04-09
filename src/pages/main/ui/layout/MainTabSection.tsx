import { Plus } from 'lucide-react';
import type { MainTab } from '../../model/types';
import MainBoardSection from '../MainBoardSection';
import MainLunchMenuSection from '../lunch/MainLunchMenuSection';
import MainRankingSection from '../ranking/MainRankingSection';
import { mockRooms } from '../room/mockRooms';
import RoomCard from '../room/RoomCard';
import RoomSummary from '../room/RoomSummary';

interface MainTabSectionProps {
  activeTab: MainTab;
  onCreateRoomClick: () => void;
}

const tabDescriptionMap: Record<MainTab, string> = {
  ROOM: '현재 열려 있는 점심 방을 둘러보고, 바로 참여할 수 있어요.',
  LUNCH: '오늘 먹을 수 있는 학식 메뉴를 mock 데이터로 먼저 확인해보세요.',
  RANKING: '좋아요를 많이 받은 인기 학식 메뉴를 둘러보세요.',
  BOARD: '자유게시판에서 점심메이트와 가볍게 소통해보세요.',
};

const MainTabSection = ({ activeTab, onCreateRoomClick }: MainTabSectionProps) => {
  const isRoomTab = activeTab === 'ROOM';

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">
            {isRoomTab ? '점심 방 둘러보기' : activeTab === 'LUNCH' ? '오늘의 학식 메뉴' : activeTab === 'RANKING' ? '지금 인기 있는 메뉴' : '자유게시판'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tabDescriptionMap[activeTab]}</p>
        </div>

        {isRoomTab ? (
          <button
            type="button"
            onClick={onCreateRoomClick}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            방 만들기
          </button>
        ) : null}
      </div>

      {isRoomTab ? <RoomSummary roomCount={mockRooms.length} /> : null}

      {activeTab === 'ROOM' ? (
        <div className="space-y-4 md:space-y-5">
          {mockRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : null}

      {activeTab === 'LUNCH' ? <MainLunchMenuSection /> : null}
      {activeTab === 'RANKING' ? <MainRankingSection /> : null}
      {activeTab === 'BOARD' ? <MainBoardSection /> : null}
    </section>
  );
};

export default MainTabSection;
