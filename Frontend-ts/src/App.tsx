import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import routes from '@configs/routerConfig';

import './App.css'

const App = () => {
  const router = createBrowserRouter(routes)
  return (
    <RouterProvider router={router} />
  )
}

export default App;
