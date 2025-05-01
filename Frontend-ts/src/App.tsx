import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import BackToUsMessage from '@components/BackToUsMessage';
import { ToastContainer } from 'react-toastify';
import routes from '@configs/routerConfig';
import '@configs/i18n';

const App = () => {
  const router = createBrowserRouter(routes)
  return (
    <>
    <RouterProvider router={router} />
    <BackToUsMessage />
      <ToastContainer
        position='top-center'
        autoClose={2000}
        closeButton={true}
        hideProgressBar={true}
        rtl={false}
        draggable={false}
      />
    </>
  )
}

export default App;
