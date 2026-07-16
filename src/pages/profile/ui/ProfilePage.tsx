import { useState } from 'react';
import { useSearchParams } from 'react-router';
import AppHeader from '@/widgets/app-header';
import FriendManagerSection from '@/features/friend/manage';
import AccountSettingsSection from '../sections/account-settings';
import ProfileEditorSection from '../sections/profile-editor';
import ProfileTabs, { type ProfileTab } from '../sections/profile-tabs';

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    searchParams.get('tab') === 'friend' ? 'FRIEND' : 'PROFILE',
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-250 flex-col gap-6 px-6 py-10 md:px-8">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'PROFILE' ? (
          <>
            <ProfileEditorSection />
            <AccountSettingsSection />
          </>
        ) : (
          <FriendManagerSection />
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
