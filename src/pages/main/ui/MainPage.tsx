import { useState } from 'react';
import { mockRooms } from '../mocks/mockRooms';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import LoginModal from './LoginModal';
import MainTabs from './MainTabs';

const MainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader onLoginClick={() => setIsLoginModalOpen(true)} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:gap-5 md:px-8 md:py-8">
        <MainHero />
        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <MainTabSection
          activeTab={activeTab}
          onCreateRoomClick={() => setIsCreateRoomModalOpen(true)}
        />
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default MainPage;
