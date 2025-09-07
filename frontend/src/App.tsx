import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"

function App() {
  const appRouter = createBrowserRouter([
    {path: '/', element: <Navbar/>},
    {path: '/signup', element: <Signup/>}
  ])
  return (
    <RouterProvider router={appRouter}/>
  )
}

export default App