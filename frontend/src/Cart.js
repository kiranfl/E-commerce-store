import { useState } from "react";
import API from "./api";

export default function Cart() {
  const [items, setItems] = useState([]);

  const checkout = async () => {
    await API.post("/orders", { items });
    alert("Order placed");
  };

  return (
    <div>
      <h2>Cart</h2>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}