import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { HelmetProvider } from "react-helmet-async"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <MainLayout /> }>
          <Route path="/" element={ <Dashboard /> }></Route>
        </Route>
        <Route path="/login" element={ <Login /> }></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App