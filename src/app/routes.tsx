import MainPage from '@/pages/main/ui/MainPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';

const routes = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
];

export default routes;
