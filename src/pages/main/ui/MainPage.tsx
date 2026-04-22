import AppHeader from '@/widgets/app-header';
import MainHero from './layout/main-hero';
import MainTabSection from './layout/main-tab-section';
import MainTabs from './layout/main-tabs';
import MainPageDialogs from './MainPageDialogs';
import { useMainPage } from '../model/useMainPage';

const MainPage = () => {
  const {
    dialogs,
    tabs,
    postSync,
  } = useMainPage();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader onLoginClick={() => dialogs.setIsLoginModalOpen(true)} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:gap-5 md:px-8 md:py-8">
        <MainHero />
        <MainTabs activeTab={tabs.activeTab} onTabChange={tabs.setActiveTab} />
        <MainTabSection
          activeTab={tabs.activeTab}
          onCreateRoomClick={() => dialogs.setIsCreateRoomModalOpen(true)}
          onCreatePostClick={() => dialogs.setIsCreatePostModalOpen(true)}
          postSyncRequest={postSync.postSyncRequest}
          onPostSyncHandled={() => postSync.setPostSyncRequest(null)}
          onRequireLogin={() => dialogs.setIsLoginModalOpen(true)}
        />
      </main>

      <MainPageDialogs
        isLoginModalOpen={dialogs.isLoginModalOpen}
        setIsLoginModalOpen={dialogs.setIsLoginModalOpen}
        isCreateRoomModalOpen={dialogs.isCreateRoomModalOpen}
        setIsCreateRoomModalOpen={dialogs.setIsCreateRoomModalOpen}
        isCreatePostModalOpen={dialogs.isCreatePostModalOpen}
        setIsCreatePostModalOpen={dialogs.setIsCreatePostModalOpen}
        setPostSyncRequest={postSync.setPostSyncRequest}
      />
    </div>
  );
};

export default MainPage;
