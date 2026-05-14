import AppHeader from '@/widgets/app-header';
import AccountSettingsSection from '../sections/account-settings';
import FriendManagerSection from '../sections/friend-manager';
import ProfileEditorSection from '../sections/profile-editor';

const ProfilePage = () => (
  <div className="min-h-screen bg-slate-50">
    <AppHeader />
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 md:px-8">
      <AccountSettingsSection />
      <ProfileEditorSection />
      <FriendManagerSection />
    </main>
  </div>
);

export default ProfilePage;
