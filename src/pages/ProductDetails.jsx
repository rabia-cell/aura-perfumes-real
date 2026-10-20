import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
function ProductDetails({ onOpenCart }) {
const { addToCart } = useCart()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
const [selectedSize, setSelectedSize] = useState('30ml')
const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const selectedVariant = product?.sizes.find(
  (item) => item.size === selectedSize
)
  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          'http://localhost:3000/api/products'
        )

        if (!response.ok) {
          throw new Error('Failed to load product')
        }

        const products = await response.json()

        const selectedProduct = products.find(
          (item) => String(item.id) === String(id)
        )

        setProduct(selectedProduct || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <Link to="/shop">← Back to Shop</Link>
        {loading && <p>Loading product...</p>}

        {error && <p>Error: {error}</p>}

        {!loading && !error && !product && (
          <p>Product not found.</p>
        )}

        {!loading && !error && product && (
<section className="product-details-content">
  <div className="product-details-image">
    <img
      src={`/images/products/${product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}.png`}
      alt={`${product.name} perfume bottle`}
      className="details-product-image"
    />
  </div>

  <div className="product-details-info">
    <h1>{product.name}</h1>

    <p>{product.category}</p>

    <p>{product.description}</p>
<h2 className="size-heading">Size</h2>
{product.sizes.map((item) => (
<button
  type="button"
  key={item.size}
  className="product-size-item"
  onClick={() => setSelectedSize(item.size)}
  aria-pressed={selectedSize === item.size}
  disabled={Number(item.stock) <= 0}
>
        <h3>{item.size}</h3>

        <p>
          Rs. {Number(item.price).toLocaleString()}
        </p>

        <p>
          {Number(item.stock) > 0
            ? `In Stock (${item.stock} available)`
            : 'Out of Stock'}
        </p>
</button>   
    ))}
{selectedVariant && (
  <div className="selected-variant">
    <h3>Selected Size: {selectedVariant.size}</h3>

    <p>
      Price: Rs. {Number(selectedVariant.price).toLocaleString()}
    </p>

    <p>
      {Number(selectedVariant.stock) > 0
        ? `In Stock (${selectedVariant.stock} available)`
        : 'Out of Stock'}
    </p>
<div className="quantity-selector">
  <button
    type="button"
    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    disabled={quantity <= 1}
  >
    −
  </button>

  <span>{quantity}</span>

  <button
    type="button"
    onClick={() =>
      setQuantity((q) =>
        Math.min(Number(selectedVariant.stock), q + 1)
      )
    }
    disabled={quantity >= Number(selectedVariant.stock)}
  >
    +
  </button>
</div>
    <button
      type="button"
      className="add-to-cart-button"
onClick={() => {
addToCart(product, selectedVariant, quantity)
onOpenCart()
}}
      disabled={Number(selectedVariant.stock) <= 0}
    >
      Add to Cart
    </button>
  </div>
)}
</div>
</section>
        )}
      </div>
    </main>
  )
}
export default ProductDetails
