import MainPage from '@/pages/main';
import ProfilePage from '@/pages/profile';

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
