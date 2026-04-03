//import MainPage from '@/pages/main/ui/MainPage';
import QueryProvider from './queryProvider';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <QueryProvider>
      <ProfilePage />
    </QueryProvider>
  );
}

export default App;
