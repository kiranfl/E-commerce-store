import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "./api";

function redirectAfterAuth(state) {
  const from = state?.from;
  if (typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && from !== "/") {
    return from;
  }
  return "/shop";
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailTrim = email.trim().toLowerCase();

  const register = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", { email: emailTrim, password });
      setMode("login");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not register");
    } finally {
      setLoading(false);
    }
  };

  const login = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email: emailTrim, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.email) localStorage.setItem("userEmail", res.data.email);
      navigate(redirectAfterAuth(location.state), { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setPassword("");
    navigate("/");
  };

  const signedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="page auth-page">
      {!signedIn ? (
        <div className="auth-split">
          <aside className="auth-showcase" aria-hidden>
            <div className="auth-showcase-inner">
              <p className="auth-showcase-tag">Portfolio storefront</p>
              <h2 className="auth-showcase-title">Shop-grade UI on a learner budget.</h2>
              <p className="auth-showcase-copy">
                Sign in to unlock the catalogue, persistent bag, and order history wired to MongoDB &amp; JWT.
              </p>
              <ul className="auth-showcase-bullets">
                <li>Responsive product discovery</li>
                <li>Checkout &amp; order APIs</li>
                <li>Clean component structure</li>
              </ul>
            </div>
          </aside>
          <div className="auth-form-column">
            <div className="auth-card card-elevated">
              <h1 className="auth-heading">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
              <p className="auth-lead">
                {mode === "login" ? "Sign in with your email to continue shopping." : "Join to save cart and checkout."}
              </p>
              <div className="tab-row">
                <button
                  type="button"
                  className={`tab ${mode === "login" ? "active" : ""}`}
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={`tab ${mode === "register" ? "active" : ""}`}
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </div>
              <form onSubmit={mode === "login" ? login : register} className="stack">
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </label>
                {error ? <p className="form-error">{error}</p> : null}
                <button type="submit" className="btn btn-primary-lg btn-full" disabled={loading}>
                  {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>
              <p className="auth-footnote">
                By continuing you agree to our dummy <span className="footer-faux-link">Terms</span> and{" "}
                <span className="footer-faux-link">Privacy</span> (layout only).
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-account-wrap">
          <div className="auth-card auth-account-card card-elevated">
            <p className="eyebrow">Signed in</p>
            <h1 className="auth-heading">Your account</h1>
            <p className="auth-lead">
              You&apos;re logged in as <strong>{localStorage.getItem("userEmail")}</strong>
            </p>
            <div className="stack account-actions">
              <Link to="/shop" className="btn btn-primary-lg btn-full">
                Continue to shop
              </Link>
              <button type="button" className="btn btn-secondary-outline btn-full" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
