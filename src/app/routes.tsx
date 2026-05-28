import MainPage from '@/pages/main';
import { ProfilePage } from '@/pages/profile';
import LoginPage from '@/pages/user';

const routes = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];

export default routes;
