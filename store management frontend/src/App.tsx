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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/product" element={<Product />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/category" element={<Category />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<AddCategory />} />
          <Route path="/risk" element={<RiskTable />} />
          <Route path="/risk-details" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
