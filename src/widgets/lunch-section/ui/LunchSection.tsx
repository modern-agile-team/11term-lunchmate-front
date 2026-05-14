import { useLunchSelection } from '../model/useLunchSelection';
import type { MainLunchMenu } from '../model/types';
import LunchMenuCard from './LunchMenuCard';
import LunchMenuDetail from './LunchMenuDetail';

interface LunchSectionProps {
  lunchMenus: MainLunchMenu[];
  onLike: (menuId: number) => void;
  onDislike: (menuId: number) => void;
}

const LunchSection = ({ lunchMenus, onLike, onDislike }: LunchSectionProps) => {
  const { selectedLunchMenuId, setSelectedLunchMenuId, selectedLunchMenu } = useLunchSelection({
    lunchMenus,
  });

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-800">
        학식은 현재 조회 전용이에요. 메뉴 상세 확인과 좋아요, 싫어요 반응만 남길 수 있습니다.
      </div>

      {lunchMenus.map((mockLunchMenu) => (
        <LunchMenuCard
          key={mockLunchMenu.id}
          menu={mockLunchMenu}
          isSelected={selectedLunchMenuId === mockLunchMenu.id}
          onSelect={setSelectedLunchMenuId}
        />
      ))}

      {selectedLunchMenu ? (
        <LunchMenuDetail menu={selectedLunchMenu} onLike={onLike} onDislike={onDislike} />
      ) : null}
    </section>
  );
};

export default LunchSection;
