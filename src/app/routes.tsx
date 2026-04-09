import MainPage from '@/pages/main/ui/layout/MainPage';
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
