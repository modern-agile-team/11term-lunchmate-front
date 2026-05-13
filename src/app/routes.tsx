import MainPage from '@/pages/main';
import { LoginPage, ProfilePage } from '@/pages/profile';

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
