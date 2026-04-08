import { RouterProvider } from 'react-router';

import QueryProvider from './queryProvider';
import router from './router';

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
