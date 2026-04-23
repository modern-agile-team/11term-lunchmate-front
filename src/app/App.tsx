import { RouterProvider } from 'react-router';

import AuthSessionBootstrap from './providers/AuthSessionBootstrap';
import QueryProvider from './queryProvider';
import router from './router';

function App() {
  return (
    <QueryProvider>
      <AuthSessionBootstrap />
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
