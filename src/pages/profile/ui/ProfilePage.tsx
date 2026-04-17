import MainHeader from '@/widgets/main-header';
import ProfileEditorSection from '@/widgets/profile-editor';

const ProfilePage = () => (
  <div className="min-h-screen bg-slate-50">
    <MainHeader />
    <main className="px-6 py-10 md:px-8">
      <ProfileEditorSection />
    </main>
  </div>
);

export default ProfilePage;
