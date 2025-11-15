import { BrowserRouter, Routes, Route } from "react-router-dom"

// Layout
import MainLayout from "./layouts/MainLayout"

// Pages
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Product from "./pages/Product"
import ProductByCathegory from "./pages/ProductByCategory";
import ShopPage from "./pages/ShopPage"
import Profile from "./pages/Profile"
import PartnershipPage from "./pages/PartnershipPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <MainLayout /> }>
          <Route path="/" element={ <Dashboard /> }></Route>
          <Route path="/category/:category" element={ <ProductByCathegory /> }></Route>
          <Route path="/shop/:shop" element={ <ShopPage /> }></Route>
          <Route path="/dashboard/shop"></Route>
          <Route path="/partnership" element={ <PartnershipPage /> }></Route>
        </Route>
        <Route path="/login" element={ <Login /> }></Route>
        <Route path="/register" element={ <Register /> }></Route>
        <Route path="/product/:id" element={ <Product /> }></Route>
        <Route path="/profile" element={ <Profile /> }></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App