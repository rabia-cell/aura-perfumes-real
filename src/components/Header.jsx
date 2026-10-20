import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
function Header({ onOpenCart }) {
  const { cartItems } = useCart()
const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <header className="aura-header">
      <nav className="aura-navbar">

        {/* Brand Logo */}
        <Link to="/" className="aura-brand">
          <span className="aura-brand-symbol" aria-hidden="true">
            ✥
          </span>

<span className="aura-brand-name">
  AURA Perfume
</span>
        </Link>

        {/* Navigation */}
        <ul className="aura-nav-links">
          <li>
            <NavLink to="/" end>Home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>

        {/* Header Actions */}
        <div className="aura-header-actions">
<button
  type="button"
  className="aura-search-button"
  aria-label={searchOpen ? 'Close search' : 'Search perfumes'}
  aria-expanded={searchOpen}
  onClick={() => setSearchOpen(!searchOpen)}
>
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
<button
  type="button"
  onClick={onOpenCart}
  className="aura-cart-button"
  aria-label={`Shopping cart with ${cartCount} items`}
>
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>

            <span className="aura-cart-count">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="aura-header-search">
          <input
            type="search"
            placeholder="Search by perfume name or category (e.g. oud, rose)"
            aria-label="Search perfumes"
            autoFocus
          />

          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
