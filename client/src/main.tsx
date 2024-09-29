import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter.tsx';
import './styles.css';
import { AuthProvider } from './context/AuthContext.tsx';
createRoot(document.getElementById('root')!).render( 
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
