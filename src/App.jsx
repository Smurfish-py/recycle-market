import { BrowserRouter, Routes, Route } from "react-router-dom"

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import {
  Dashboard,
  Login,
  Register,
  ProfilePage,
  EditProfile,
  PartnershipPage,
  Product,
  ProductByCategory,
  BookmarkPage
} from "@/pages/default/index.js";

import { 
  ShopPage,
  SellForm,
  PartnershipForm,
  ShopEdit
} from "@/pages/partner/index.js";

import {
  Admin, 
  UserListAdmin,
  AdminProduct
} from "@/pages/admin/index";

import ManagementLayout from "@/layouts/ManagementLayout";
import UserDetails from "@/pages/admin/UserDetails";
import { PolicyPage } from "./pages/default";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={ <MainLayout /> }>
          <Route path="/" element={ <Dashboard /> }></Route>
          <Route path="/profile/" element={ <ProfilePage /> }></Route>
          <Route path="/partnership/form/" element={ <PartnershipForm /> }></Route>
          <Route path="/category/:category" element={ <ProductByCategory /> }></Route>
          <Route path="/shop/:id" element={ <ShopPage /> }></Route>
          <Route path="/shop/:id/edit" element={ <ShopEdit /> }></Route>
          <Route path="/bookmark" element={ <BookmarkPage /> }></Route>
          <Route path="/partnership" element={ <PartnershipPage /> }></Route>
          <Route path="/sell" element={<SellForm />}></Route>
        </Route>
        <Route element={ <ManagementLayout /> }>
        {/* Admin */}
          <Route path="/dashboard/admin" element={<Admin />}></Route>
          <Route path="/dashboard/admin/pengguna" element={ <UserListAdmin /> }></Route>
          <Route path="/dashboard/admin/pengguna/detail/:id" element={ <UserDetails /> }></Route>
          <Route path="/dashboard/admin/produk" element={ <AdminProduct /> }></Route>
          <Route path="/dashboard/admin/requests"></Route>
          <Route path="/dashboard/admin/pesanan"></Route>
        {/* Partner */}
        </Route>
        <Route path="/login" element={ <Login /> }></Route>
        <Route path="/register" element={ <Register /> }></Route>
        <Route path="/product/:id" element={ <Product /> }></Route>
        <Route path="/profile/edit" element={ <EditProfile /> }></Route>
        <Route path="/partnership/policy" element={ <PolicyPage /> }></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App