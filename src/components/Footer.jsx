import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="aura-footer">
      <div className="aura-footer-content">
        <Link to="/" className="aura-footer-brand">
          <span className="aura-brand-symbol">✥</span>
          <span>AURA Perfume</span>
        </Link>

        <nav className="aura-footer-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="aura-footer-bottom">
          <p>© {new Date().getFullYear()} AURA Perfume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
