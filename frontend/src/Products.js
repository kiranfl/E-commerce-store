import { useEffect, useState } from "react";
import API from "./api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p._id}>
          {p.name} - ₹{p.price}
          <button onClick={() => setCart([...cart, { ...p, qty: 1 }])}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
}