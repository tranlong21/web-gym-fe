import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./components/auth/AuthPage.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import ExercisesDetail from "./components/exercises/ExercisesDetail.jsx";
import Shop from "./components/shop/Shop.jsx";
import Cart from "./components/shop/Cart.jsx";
import Checkout from "./components/shop/Checkout.jsx";
import Header from "./components/share/Header.jsx";
import AdminGym from "./page/AdminGym.jsx";
import ExercisesAdmin from "./components/admin/ExercisesAdmin.jsx"; 
import AdminDashboard from "./components/layout _admin/AdminDashboard.jsx"; 
import ShopAdmin from "./components/admin/ShopAdmin.jsx";
import ManagerUsers from "./components/admin/ManagerUsers.jsx";
import Muscle from "./components/muscle.jsx"; 
import LandingPageBan from "./components/LandingPageBan.jsx";
import HistoryOrders from "./components/HistoryOrders.jsx";

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<AuthPage />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercises" element={<ExercisesDetail />} />
        <Route path="/exercises/:muscleId" element={<ExercisesDetail />} />
        <Route path="/muscle" element={<Muscle />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home" element={<Home />} />
        <Route path="/banned" element={<LandingPageBan />} />
        <Route path="/history" element={<HistoryOrders />} />
        <Route path="/header" element={<Header />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminGym />} />
        <Route path="/admin/exercises" element={<ExercisesAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/shop" element={<ShopAdmin />} /> 
        <Route path="/admin/users" element={<ManagerUsers />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;