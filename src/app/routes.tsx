import RequireAuth from './providers/RequireAuth';
import MainPage from '@/pages/main';
import { ProfilePage } from '@/pages/profile';
import { LoginPage, SignUpPage, SocialSignUpPage } from '@/pages/user';

const routes = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/register/social',
    element: <SocialSignUpPage />,
  },
];

export default routes;
