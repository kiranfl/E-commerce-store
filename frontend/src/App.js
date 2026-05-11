import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth";
import Auth from "./Auth";
import Products from "./Products";
import Cart from "./Cart";
import Orders from "./Orders";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Auth />} />
            <Route element={<RequireAuth />}>
              <Route path="/shop" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
            <Route path="/auth" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
