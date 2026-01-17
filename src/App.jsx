import { BrowserRouter, Routes, Route } from "react-router-dom"

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import { Dashboard, Login, Register, Profile, PartnershipPage, Product, ProductByCategory } from "@/pages/default/index.js"
import ShopPage from "./pages/ShopPage";
import SellForm from "./pages/SellForm";
import { Admin, UserListAdmin } from "@/pages/admin/index";
import ManagementLayout from "./layouts/ManagementLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <MainLayout /> }>
          <Route path="/" element={ <Dashboard /> }></Route>
          <Route path="/category/:category" element={ <ProductByCategory /> }></Route>
          <Route path="/shop/:shop" element={ <ShopPage /> }></Route>
          <Route path="/dashboard/shop" element={<ShopPage />}></Route>
          <Route path="/partnership" element={ <PartnershipPage /> }></Route>
          <Route path="/sell" element={<SellForm />}></Route>
        </Route>
        <Route element={ <ManagementLayout /> }>
        {/* Admin */}
          <Route path="/dashboard/admin" element={<Admin />}></Route>
          <Route path="/dashboard/admin/pengguna" element={ <UserListAdmin /> }></Route>
          <Route path="/dashboard/admin/produk"></Route>
          <Route path="/dashboard/admin/pengaduan"></Route>
          <Route path="/dashboard/admin/pesanan"></Route>
        {/* Partner */}
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