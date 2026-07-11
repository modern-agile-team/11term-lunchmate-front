import MainPage from '@/pages/main';
import { ProfilePage } from '@/pages/profile';
import { SignUpPage } from '@/pages/user';

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
    path: '/signup',
    element: <SignUpPage />,
  },
];

export default routes;
