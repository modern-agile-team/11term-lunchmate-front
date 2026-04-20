import AppHeader from '@/widgets/app-header';
import ProfileEditorSection from './profile';

const ProfilePage = () => (
  <div className="min-h-screen bg-slate-50">
    <AppHeader />
    <main className="px-6 py-10 md:px-8">
      <ProfileEditorSection />
    </main>
  </div>
);

export default ProfilePage;
