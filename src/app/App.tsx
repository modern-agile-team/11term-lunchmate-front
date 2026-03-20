import MainPage from '@/pages/main/ui/MainPage';
import QueryProvider from './queryProvider';

function App() {
  return (
    <QueryProvider>
      <MainPage />
    </QueryProvider>
  );
}

export default App;
