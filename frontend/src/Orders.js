import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

const money = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    n
  );

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 10 ? `#${s.slice(-8).toUpperCase()}` : `#${s}`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    API.get("/orders")
      .then(res => {
        if (!cancelled) setOrders(res.data);
      })
      .catch(() => {
        if (!cancelled) setErr("We couldn’t load your orders right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="page page-pad">
        <div className="empty-state empty-state--compact">
          <h1 className="page-title">Orders</h1>
          <p className="empty-lead">Sign in to view purchase history and delivery details.</p>
          <Link to="/" className="btn btn-primary-lg">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page page-pad">
        <div className="loading-block">
          <div className="spinner" aria-hidden />
          <p className="muted">Loading your orders…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="page page-pad">
        <div className="alert alert-error">{err}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page page-pad">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/shop">Home</Link>
            </li>
            <li aria-current="page">Orders</li>
          </ol>
        </nav>
        <div className="empty-state">
          <h1 className="page-title">No orders yet</h1>
          <p className="empty-lead">Your completed purchases will appear here with item lines and totals.</p>
          <Link to="/shop" className="btn btn-primary-lg">
            Start shopping
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
          <li aria-current="page">Orders</li>
        </ol>
      </nav>

      <header className="page-header-block">
        <h1 className="page-title">Your orders</h1>
        <p className="section-sub">{orders.length} {orders.length === 1 ? "order" : "orders"} on file</p>
      </header>

      <ul className="order-list">
        {orders.map(o => (
          <li key={o._id} className="order-card card-elevated">
            <div className="order-card-top">
              <div>
                <span className="order-id">{shortId(o._id)}</span>
                <p className="order-date">{formatDate(o.createdAt)}</p>
              </div>
              <div className="order-card-top-right">
                <span className="order-status">Delivered</span>
                <strong className="order-total">{money(o.total)}</strong>
              </div>
            </div>
            <div className="order-items-table">
              {o.items.map((it, idx) => (
                <div key={`${o._id}-${idx}`} className="order-line">
                  <span className="order-line-name">{it.name}</span>
                  <span className="order-line-qty">×{it.qty}</span>
                  <span className="order-line-price">{money(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="order-card-foot">
              <span className="footer-faux-link order-track-demo">Track package (demo)</span>
              <Link to="/shop" className="text-link-subtle">
                Buy again
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
