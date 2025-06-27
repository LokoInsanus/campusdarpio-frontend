import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './pages/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// test

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);