import { DataProvider } from './store/dataContext.jsx';
import { AuthProvider } from './store/authContext.jsx';
import { SocketProvider } from './store/socketContext.jsx';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <DataProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </DataProvider>
  </AuthProvider>
);
