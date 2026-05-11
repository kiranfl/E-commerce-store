import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";
import { useCart } from "./CartContext";

const money = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    n
  );

function CartThumb({ src, name }) {
  if (src) {
    return <img src={src} alt="" className="cart-thumb-img" loading="lazy" />;
  }
  return <div className="cart-thumb-fallback">{(name || "?").charAt(0)}</div>;
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, setQty, removeItem, clearCart, subtotal } = useCart();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (items.length === 0) return;
    setStatus("");
    setSubmitting(true);
    try {
      const payload = items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty
      }));
      await API.post("/orders", { items: payload });
      clearCart();
      setStatus("Order placed successfully.");
      navigate("/orders");
    } catch (err) {
      setStatus(err.response?.data?.msg || "Checkout failed. Try signing in again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page page-pad">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/shop">Home</Link>
            </li>
            <li aria-current="page">Cart</li>
          </ol>
        </nav>
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden>
            <span className="empty-bag" />
          </div>
          <h1 className="page-title">Your bag is empty</h1>
          <p className="empty-lead">Discover desk upgrades and audio picks on the shop floor.</p>
          <Link to="/shop" className="btn btn-primary-lg">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-pad">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/shop">Home</Link>
          </li>
          <li aria-current="page">Shopping bag</li>
        </ol>
      </nav>

      <header className="page-header-block">
        <h1 className="page-title">Shopping bag</h1>
        <p className="section-sub">{items.length} {items.length === 1 ? "item" : "items"} · Not charged until you place the order</p>
      </header>

      <div className="cart-layout">
        <div className="cart-table-wrap">
          <div className="cart-thead" aria-hidden>
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          <ul className="cart-list">
            {items.map(line => (
              <li key={line.productId} className="cart-row">
                <div className="cart-product-cell">
                  <CartThumb src={line.image} name={line.name} />
                  <div className="cart-product-meta">
                    <span className="cart-name">{line.name}</span>
                    <span className="cart-unit">{money(line.price)} each</span>
                    <button type="button" className="cart-remove" onClick={() => removeItem(line.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
                <label className="qty-field">
                  <span className="sr-only">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    value={line.qty}
                    onChange={e => setQty(line.productId, e.target.value)}
                  />
                </label>
                <span className="cart-line-total">{money(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="cart-summary card-elevated">
          <h2 className="summary-heading">Order summary</h2>
          <div className="summary-lines">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="summary-line summary-line-muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-line summary-line-muted">
              <span>Estimated tax</span>
              <span>—</span>
            </div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <button type="button" className="btn btn-checkout" disabled={submitting} onClick={checkout}>
            {submitting ? "Placing order…" : "Place order securely"}
          </button>
          {status ? <p className="form-error summary-error">{status}</p> : null}
          <ul className="trust-list">
            <li>256-bit SSL demo checkout</li>
            <li>Order confirmation on the next screen</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
