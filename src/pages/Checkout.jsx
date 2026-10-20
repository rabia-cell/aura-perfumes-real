import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function Checkout() {
const { cartItems, clearCart } = useCart()
const [isSubmitting, setIsSubmitting] = useState(false)
const [orderError, setOrderError] = useState('')
const [orderSuccess, setOrderSuccess] = useState('')
const total = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
)
async function handlePlaceOrder(event) {
  event.preventDefault()
  const form = event.currentTarget

  if (isSubmitting || cartItems.length === 0) return

  setIsSubmitting(true)
  setOrderError('')
  setOrderSuccess('')

  const formData = new FormData(event.currentTarget)

  const orderData = {
    first_name: formData.get('firstName'),
    last_name: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    items: cartItems.map((item) => ({
      product_id: item.productId,
      product_name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity
    }))
  }

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Order could not be placed')
    }

    clearCart()
setOrderSuccess('Order Placed Successfully!')
form.reset()    
  } catch (error) {
    setOrderError(error.message)
  } finally {
    setIsSubmitting(false)
  }
}
  return (
    <main className="checkout-page">
      <Link to="/shop">← Continue Shopping</Link>

      <h1>Checkout</h1>
      <p>Complete your details and review your order.</p>

      <div className="checkout-layout">
<section className="checkout-details">
  <h2>Your Details</h2>
<form id="checkout-form" onSubmit={handlePlaceOrder}>
    <div className="checkout-name-row">
      <label>
        First Name
        <input type="text" name="firstName" required />
      </label>

      <label>
        Last Name
        <input type="text" name="lastName" required />
      </label>
    </div>

    <label>
      Email Address
      <input type="email" name="email" required />
    </label>

    <label>
      Phone Number
      <input type="tel" name="phone" required />
    </label>

    <label>
      Delivery Address
      <textarea name="address" rows="3" required />
    </label>

    <label>
      City
      <input type="text" name="city" required />
    </label>
<button
  type="submit"
  disabled={isSubmitting || cartItems.length === 0}
>
  {isSubmitting ? 'Placing Order...' : 'Place Order'}
</button>
{orderError && (
  <p role="alert" className="checkout-error">
    {orderError}
  </p>
)}
{orderSuccess && (
  <div role="status" className="checkout-success">
    <strong>{orderSuccess}</strong>
    <p>Thank you for shopping with Aura Perfumes.</p>
  </div>
)}
  </form>
</section>
<section className="checkout-summary">
  <h2>Order Summary</h2>

  {cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <>
      {cartItems.map((item) => (
        <div
          className="checkout-item"
          key={`${item.productId}-${item.size}`}
        >
          <img src={item.image} alt={item.name} />

          <div className="checkout-item-info">
            <strong>{item.name}</strong>
            <p>{item.size} · Qty {item.quantity}</p>
          </div>

          <strong>
            Rs. {(item.price * item.quantity).toLocaleString()}
          </strong>
        </div>
      ))}

      <div className="checkout-total">
        <span>Total</span>
        <strong>Rs. {total.toLocaleString()}</strong>
      </div>
    </>
  )}
</section>
      </div>
    </main>
  )
}

export default Checkout
