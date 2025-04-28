import { StrictMode } from 'react'
import { QueryClient} from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import ComponentWithProviders from '@components/ComponentWithProviders.tsx'
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ComponentWithProviders>
      <App/>
    </ComponentWithProviders>
  </StrictMode>,
)
