import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ComponentWithProviders from '@components/ComponentWithProviders'
import App from './App'


createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ComponentWithProviders>
      <App/>
    </ComponentWithProviders>
  </StrictMode>,
)
