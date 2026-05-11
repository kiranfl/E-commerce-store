import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import { useCart } from "./CartContext";

const money = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    n
  );

function StarRow({ rating }) {
  const r = Number(rating) || 4.5;
  const rounded = Math.min(5, Math.max(0, Math.round(r)));
  return (
    <div className="star-row" aria-label={`Rated ${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= rounded ? "filled" : ""}`} aria-hidden>
          ★
        </span>
      ))}
      <span className="rating-num">{r.toFixed(1)}</span>
    </div>
  );
}

function ProductThumb({ src, name }) {
  if (src) {
    return <img className="product-thumb-img" src={src} alt="" loading="lazy" />;
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="product-thumb-fallback" aria-hidden>
      {initial}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map(i => (
        <li key={i} className="product-card product-card--skeleton">
          <div className="product-thumb skeleton-block" />
          <div className="product-card-body">
            <div className="skeleton-line skeleton-line--lg" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line--sm" />
          </div>
        </li>
      ))}
    </>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [category, setCategory] = useState("All");
  const { addItem } = useCart();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let cancelled = false;
    API.get("/products")
      .then(res => {
        if (!cancelled) setProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) setErr("We couldn’t load the catalogue. Please check that the API is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category || "General"));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter(p => (p.category || "General") === category);
  }, [products, category]);

  if (err) {
    return (
      <div className="page page-pad">
        <div className="alert alert-error">{err}</div>
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
          <li aria-current="page">Shop</li>
        </ol>
      </nav>

      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="eyebrow">Curated for your desk</p>
          <h1 className="shop-hero-title">Upgrade how you work &amp; listen</h1>
          <p className="shop-hero-lead">
            Premium-feel product cards, ratings, and a cart that remembers you — built as a portfolio-ready
            commerce flow.
          </p>
          <div className="shop-hero-cta">
            {token ? (
              <Link to="/cart" className="btn btn-primary-lg">
                View bag
              </Link>
            ) : (
              <Link to="/" className="btn btn-primary-lg">
                Sign in to shop
              </Link>
            )}
            <span className="hero-meta">INR prices · Demo inventory</span>
          </div>
        </div>
        <div className="shop-hero-art" aria-hidden />
      </section>

      <div className="shop-toolbar">
        <div>
          <h2 className="section-title">All products</h2>
          <p className="section-sub">{filtered.length} items in this view</p>
        </div>
        <div className="category-pills" role="tablist" aria-label="Filter by category">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              className={`category-pill${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ul className="product-grid">
        {loading ? (
          <ProductSkeleton />
        ) : (
          filtered.map(p => (
            <li key={p._id} className="product-card">
              <button type="button" className="product-wish" aria-label={`Save ${p.name}`} disabled title="Wishlist demo">
                ♡
              </button>
              <div className="product-thumb">
                <ProductThumb src={p.image} name={p.name} />
                {p.stock != null && p.stock > 0 && p.stock <= 10 ? (
                  <span className="product-badge product-badge-warn">Selling fast</span>
                ) : null}
                {p.stock === 0 ? <span className="product-badge product-badge-ghost">Sold out</span> : null}
              </div>
              <div className="product-card-body">
                <p className="product-category">{p.category || "Accessories"}</p>
                <h3 className="product-name">{p.name}</h3>
                <StarRow rating={p.rating} />
                {p.description ? <p className="product-desc">{p.description}</p> : null}
                <div className="product-row-price">
                  <span className="product-price">{money(p.price)}</span>
                  {p.stock != null && p.stock > 0 ? (
                    <span className="product-stock-ok">{p.stock} in stock</span>
                  ) : p.stock === 0 ? (
                    <span className="product-stock-no">Unavailable</span>
                  ) : null}
                </div>
              </div>
              <div className="product-card-actions">
                <button
                  type="button"
                  className="btn btn-cart"
                  disabled={p.stock === 0}
                  onClick={() => addItem(p)}
                >
                  Add to bag
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
