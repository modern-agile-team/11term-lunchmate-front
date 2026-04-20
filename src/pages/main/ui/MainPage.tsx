import PostEditorModal from '@/features/post/create';
import RoomEditorModal from '@/features/room/create';
import AppHeader from '@/widgets/app-header';
import AuthDialog from '@/widgets/auth-dialog';
import MainHero from './layout/main-hero';
import MainTabSection from './layout/main-tab-section';
import MainTabs from './layout/main-tabs';
import { useMainPage } from '../model/useMainPage';

const MainPage = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    activeTab,
    setActiveTab,
    isCreateRoomModalOpen,
    setIsCreateRoomModalOpen,
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    postSyncRequest,
    setPostSyncRequest,
  } = useMainPage();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader onLoginClick={() => setIsLoginModalOpen(true)} />

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

      <AuthDialog isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <RoomEditorModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onRequireLogin={() => setIsLoginModalOpen(true)}
      />
      <PostEditorModal
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
