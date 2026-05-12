import MainPage from '@/pages/main';
import ProfilePage from '@/pages/profile';
import LoginPage from '@/pages/profile/ui/LoginPage';

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
    path: '/profile/ui/login',
    element: <LoginPage />,
  },
];

export default routes;
