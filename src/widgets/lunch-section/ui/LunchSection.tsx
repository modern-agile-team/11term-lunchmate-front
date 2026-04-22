import { mockLunchMenus } from '../model/mockLunchMenus';
import { useLunchSelection } from '../model/useLunchSelection';
import LunchMenuCard from './LunchMenuCard';
import LunchMenuDetail from './LunchMenuDetail';

const LunchSection = () => {
  const { selectedLunchMenuId, setSelectedLunchMenuId, selectedLunchMenu } = useLunchSelection({
    lunchMenus: mockLunchMenus,
  });

  return (
    <section className="space-y-4 md:space-y-5">
      {mockLunchMenus.map((mockLunchMenu) => (
        <LunchMenuCard
          key={mockLunchMenu.id}
          menu={mockLunchMenu}
          isSelected={selectedLunchMenuId === mockLunchMenu.id}
          onSelect={setSelectedLunchMenuId}
        />
      ))}

      {selectedLunchMenu ? <LunchMenuDetail menu={selectedLunchMenu} /> : null}
    </section>
  );
};

export default LunchSection;
