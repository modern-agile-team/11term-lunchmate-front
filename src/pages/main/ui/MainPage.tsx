import { mockRooms } from '../model/mockRooms';
import MainHeader from './MainHeader';
import MainIntro from './MainIntro';
import MainTabs from './MainTabs';
import RoomList from './RoomList';
import RoomStatus from './RoomStatus';

const MainPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-6">
        <MainIntro />
        <MainTabs />
        <RoomStatus roomCount={mockRooms.length} />
        <RoomList rooms={mockRooms} />
      </main>
    </div>
  );
};

export default MainPage;
