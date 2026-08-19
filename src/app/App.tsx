import { RouterProvider } from 'react-router';

import AuthSessionBootstrap from './providers/AuthSessionBootstrap';
import QueryProvider from './queryProvider';
import router from './router';
import RoomSocketConnection from '@/shared/socket/RoomSocketConnection';

function App() {
  return (
    <QueryProvider>
      <AuthSessionBootstrap />
      <RoomSocketConnection />
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
