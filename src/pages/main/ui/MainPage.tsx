import { useState } from 'react';
import LoginModal from '@/features/auth';
import CreatePostModal from '@/features/post-editor';
import CreateRoomModal from '@/features/room-editor';
import MainHeader from '@/widgets/main-header';
import MainHero from '@/widgets/main-hero';
import MainTabSection from '@/widgets/main-tab-section';
import MainTabs, { type MainTab } from '@/widgets/main-tabs';
import type { PostSyncRequest } from '@/widgets/post-section/model/types';

const MainPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('ROOM');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postSyncRequest, setPostSyncRequest] = useState<PostSyncRequest | null>(null);

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
          postSyncRequest={postSyncRequest}
          onPostSyncHandled={() => setPostSyncRequest(null)}
          onRequireLogin={() => setIsLoginModalOpen(true)}
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
        onSuccess={(post) => {
          setPostSyncRequest(post);
        }}
      />
    </div>
  );
};

export default MainPage;
