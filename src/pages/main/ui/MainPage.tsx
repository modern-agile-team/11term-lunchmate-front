import { mockRooms } from '../model/mockRooms';
import MainHeader from '../../../widgets/main-header/ui/MainHeader';
import MainIntro from '../../../widgets/main-intro/ui/MainIntro';
import MainTabs from '../../../widgets/main-tabs/ui/MainTabs';
import RoomList from '../../../widgets/room-list/ui/RoomList';
import RoomStatus from '../../../widgets/room-status/ui/RoomStatus';

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
