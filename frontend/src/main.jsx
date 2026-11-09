import { AuthProvider } from './store/authContext.jsx';
import { ThemeProvider } from './store/ThemeContext.jsx';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>

);
