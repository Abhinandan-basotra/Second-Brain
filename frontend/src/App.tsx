import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { Flip, ToastContainer } from "react-toastify"
import { RecoilRoot } from "recoil"
import Home from "./pages/Home"

function App() {
  const appRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/signup', element: <Signup /> },
    { path: '/login', element: <Login /> },
    {path: '/home', element: <Home/>},

    { path: '*', element: <Home /> }
  ])
  return (
    <>
      <RecoilRoot>
        <RouterProvider router={appRouter} />
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Flip}
        />
      </RecoilRoot>
    </>
  )
}

export default App