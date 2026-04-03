import { useState } from 'react';

import type { MainTab } from '../model/types';
import CreateRoomModal from './CreateRoomModal';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainTabSection from './MainTabSection';
import MainTabs from './MainTabs';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('ROOM');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:gap-5 md:px-8 md:py-8">
        <MainHero />
        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <MainTabSection
          activeTab={activeTab}
          onCreateRoomClick={() => setIsCreateRoomModalOpen(true)}
        />
      </main>

      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
      />
    </div>
  );
};

export default MainPage;
