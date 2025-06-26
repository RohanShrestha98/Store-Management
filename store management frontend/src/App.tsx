import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import Login from "./pages/auth/login";
import AuthLayout from "./layouts/AuthLayout";
import Users from "./pages/users/Users";
import Dashboard from "./pages/dashboard/Dashboard";
import RiskTable from "./pages/risktable/RiskTable";
import User from "./pages/user/User";
import Settings from "./pages/settings/Settings";
import Notification from "./pages/notification/Notification";
import SignUp from "./pages/auth/signup";
import Product from "./pages/product/Product";
import AddProduct from "./pages/product/AddProduct";
import Category from "./pages/category/Category";
import AddCategory from "./pages/category/AddCategory";
import Store from "./pages/store/Store";
import Vendor from "./pages/vendor/Vendor";
import UserProduct from "./pages/userside/UserProduct";
import SalesHistory from "./pages/sales history/SalesHistory";
import StoreProduct from "./pages/store/StoreProduct";
import ClockIn from "./pages/auth/ClockIn";
import { useAuthStore } from "./store/useAuthStore";
import VendorProduct from "./pages/vendor/VendorProduct";
import Profile from "./pages/profile/Profile";

function App() {
  const { user } = useAuthStore();
  const isAdmin = user?.data?.role !== "Staff";
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/clock-in" element={<ClockIn />} />
        </Route>

        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={isAdmin && <User />} />
          <Route path="/store" element={isAdmin && <Store />} />
          <Route
            path="/store-product/:id"
            element={isAdmin && <StoreProduct />}
          />
          <Route path="/vendor" element={isAdmin && <Vendor />} />
          <Route
            path="/vendor-product/:id"
            element={isAdmin && <VendorProduct />}
          />
          <Route path="/product" element={isAdmin && <Product />} />
          <Route path="/add-product" element={isAdmin && <AddProduct />} />
          <Route path="/edit-product/:id" element={isAdmin && <AddProduct />} />
          <Route path="/category" element={isAdmin && <Category />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/add-category" element={isAdmin && <AddCategory />} />
          <Route
            path="/edit-category/:id"
            element={isAdmin && <AddCategory />}
          />
          <Route path="/pay-check" element={isAdmin && <Users />} />
          <Route path="/user-product" element={<UserProduct />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
