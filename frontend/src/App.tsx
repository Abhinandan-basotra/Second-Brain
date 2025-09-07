import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"

function App() {
  const appRouter = createBrowserRouter([
    {path: '/', element: <Navbar/>},
    {path: '/signup', element: <Signup/>},
    {path: '/login', element: <Login/>},


    {path: '*', element: <Navbar/>}
  ])
  return (
    <RouterProvider router={appRouter}/>
  )
}

export default App