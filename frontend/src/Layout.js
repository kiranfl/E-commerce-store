import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "./CartContext";

function IconCart({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L4.5 4H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Layout() {
  const { totalQty } = useCart();
  const token = localStorage.getItem("token");

  return (
    <div className="app-shell">
      <div className="promo-strip" role="note">
        <span>Free standard delivery on demo orders</span>
        <span className="promo-dot" aria-hidden />
        <span>Secure checkout</span>
        <span className="promo-dot" aria-hidden />
        <span>Easy returns within 30 days</span>
      </div>

      <header className="site-header">
        <div className="header-row">
          <NavLink to={token ? "/shop" : "/"} className="brand-mark" end>
            <span className="brand-icon" aria-hidden>
              S
            </span>
            <span className="brand-text">
              Studio<span className="brand-accent">Market</span>
            </span>
          </NavLink>

          <label className="header-search">
            <span className="sr-only">Search</span>
            <input type="search" placeholder="Search for products, brands and more" readOnly tabIndex={-1} />
            <span className="search-glyph" aria-hidden>
              ⌕
            </span>
          </label>

          <nav className="header-actions" aria-label="Account and cart">
            <NavLink to="/" className={({ isActive }) => `header-icon-link${isActive ? " active" : ""}`} end>
              <IconUser className="header-svg" />
              <span>{token ? "Account" : "Sign in"}</span>
            </NavLink>
            {token ? (
              <NavLink to="/cart" className={({ isActive }) => `header-icon-link${isActive ? " active" : ""}`}>
                <span className="cart-icon-wrap">
                  <IconCart className="header-svg" />
                  {totalQty > 0 ? <span className="cart-count">{totalQty > 99 ? "99+" : totalQty}</span> : null}
                </span>
                <span>Cart</span>
              </NavLink>
            ) : null}
          </nav>
        </div>

        {token ? (
          <div className="header-subnav-wrap">
            <nav className="header-subnav" aria-label="Departments">
              <NavLink to="/shop" className={({ isActive }) => (isActive ? "subnav-link active" : "subnav-link")} end>
                All products
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? "subnav-link active" : "subnav-link")}>
                My orders
              </NavLink>
              <span className="subnav-muted">Desk · Audio · Home</span>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-col footer-brand-col">
            <div className="brand-mark footer-brand-static">
              <span className="brand-icon">S</span>
              <span className="brand-text">
                Studio<span className="brand-accent">Market</span>
              </span>
            </div>
            <p className="footer-tagline">
              A portfolio storefront demo — thoughtful UI, catalogue, cart, and orders wired to a real API.
            </p>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li>
                <NavLink to={token ? "/shop" : "/"}>Browse</NavLink>
              </li>
              {token ? (
                <>
                  <li>
                    <NavLink to="/cart">Shopping cart</NavLink>
                  </li>
                  <li>
                    <NavLink to="/orders">Order history</NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="/">Sign in to shop</NavLink>
                </li>
              )}
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">Help</h3>
            <ul className="footer-links">
              <li>
                <span className="footer-faux-link">Shipping &amp; returns</span>
              </li>
              <li>
                <span className="footer-faux-link">Contact us</span>
              </li>
              <li>
                <span className="footer-faux-link">Size guides</span>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-newsletter">
            <h3 className="footer-heading">Stay in the loop</h3>
            <p className="footer-news-copy">Dummy newsletter field for layout — portfolio only.</p>
            <div className="footer-email-row">
              <input type="email" placeholder="Email address" readOnly tabIndex={-1} />
              <button type="button" className="btn btn-footer-signup" disabled>
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Studio Market · React · Express · MongoDB</p>
          <div className="footer-legal">
            <span className="footer-faux-link">Privacy</span>
            <span className="footer-faux-link">Terms</span>
            <span className="footer-faux-link">Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
