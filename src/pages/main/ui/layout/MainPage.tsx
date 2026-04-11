import { useState } from 'react';
import LoginModal from '../auth/LoginModal';
import CreatePostModal from '../board/CreatePostModal';
import type { MainBoardCreatedPostSyncRequest } from '../board/types';
import CreateRoomModal from '../room/CreateRoomModal';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainTabs from './MainTabs';
import type { MainTab } from '../../model/types';
import MainTabSection from './MainTabSection';

const MainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('ROOM');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [createdPostSyncRequest, setCreatedPostSyncRequest] =
    useState<MainBoardCreatedPostSyncRequest | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader onLoginClick={() => setIsLoginModalOpen(true)} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:gap-5 md:px-8 md:py-8">
        <MainHero />
        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <MainTabSection
          activeTab={activeTab}
          onCreateRoomClick={() => setIsCreateRoomModalOpen(true)}
          onCreatePostClick={() => setIsCreatePostModalOpen(true)}
          createdPostSyncRequest={createdPostSyncRequest}
          onCreatedPostSyncHandled={() => setCreatedPostSyncRequest(null)}
          onJoinRequireLogin={() => setIsLoginModalOpen(true)}
        />
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onRequireLogin={() => setIsLoginModalOpen(true)}
      />
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onRequireLogin={() => setIsLoginModalOpen(true)}
        onSuccess={(createdPost) => {
          setCreatedPostSyncRequest(createdPost);
        }}
      />
    </div>
  );
};

export default MainPage;
