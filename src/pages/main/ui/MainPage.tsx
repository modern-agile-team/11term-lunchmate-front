import { mockRooms } from '../mocks/mockRooms';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainTabs from './MainTabs';
import RoomCard from './RoomCard';
import RoomSummary from './RoomSummary';

const MainPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:gap-5 md:px-8 md:py-8">
        <MainHero />
        <MainTabs />
        <RoomSummary roomCount={mockRooms.length} />

        <section className="space-y-4 md:space-y-5">
          {mockRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
