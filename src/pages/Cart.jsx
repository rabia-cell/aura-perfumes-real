import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
function Cart({ onClose }) {
const navigate = useNavigate()
const {
  cartItems,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity
} = useCart()

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
<div className="cart-overlay">    
      <button
        type="button"
        className="cart-backdrop"
        aria-label="Close cart"
onClick={onClose}        
      />

      <aside className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>

          <button
            type="button"
onClick={onClose}            
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <>
              <p>Your cart is empty.</p>
              <Link to="/shop">Continue Shopping</Link>
            </>
          ) : (
            cartItems.map((item) => (
              <div
                className="cart-drawer-item"
                key={`${item.productId}-${item.size}`}
              >
<div className="cart-product-info">
  <img
    src={item.image || `/images/products/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`}
    alt={item.name}
    className="cart-product-image"
  />

  <div>
    <h3>{item.name}</h3>
<p>{item.size}</p>

<div className="cart-quantity-controls">
  <button
    type="button"
    onClick={() => decreaseQuantity(item.productId, item.size)}
    disabled={item.quantity <= 1}
  >
    −
  </button>
<span>{item.quantity}</span>
<button
  type="button"
  onClick={() => increaseQuantity(item.productId, item.size)}
  disabled={
    !Number.isFinite(Number(item.stock)) ||
    Number(item.stock) <= 0 ||
    item.quantity >= Number(item.stock)
  }
>
  +
</button>
</div>

<button
  type="button"
  className="cart-remove-button"
  onClick={() => removeFromCart(item.productId, item.size)}
>
  Remove
</button>    
  </div>
</div>
                <strong>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>
<button
  type="button"
  className="checkout-button"
  onClick={() => {
    onClose()
    navigate('/checkout')
  }}
>
  Checkout
</button>
          </div>
        )}
      </aside>
    </div>
  )
}

export default Cart
