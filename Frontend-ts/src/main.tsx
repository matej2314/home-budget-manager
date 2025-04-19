import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@store/authContext.tsx'
import { DataProvider } from '@store/dataContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
      <App />
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
)
