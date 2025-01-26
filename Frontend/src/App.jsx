import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './configs/routerConfig';
// import './configs/i18n';



export default function App() {

  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    }
  })




  return (
    <RouterProvider router={router} />
  )
}


