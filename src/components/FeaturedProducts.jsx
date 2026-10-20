import { Link, useSearchParams } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
function FeaturedProducts({ title = 'Our Featured Perfumes' }) {
  const sliderRef = useRef(null)
const [searchParams, setSearchParams] = useSearchParams()
const searchOpen = searchParams.get('search') === 'open'
  const [search, setSearch] = useState('')
const [category, setCategory] = useState('All')  
const {
  data: products = [],
  isPending: loading,
  error
} = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const response = await fetch('https://aura-backend-9nq5.onrender.com/api/products')

    if (!response.ok) {
      throw new Error('Failed to load products')
    }

    return response.json()
  },
  staleTime: 60 * 1000
})
const filteredProducts = products.filter((product) => {
  const keyword = search.toLowerCase().trim()

  const matchesSearch =
    product.name.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword)

  const matchesCategory =
    category === 'All' || product.category === category

  return matchesSearch && matchesCategory
})
  return (
    <section className="featured-products">
      <div className="featured-container">
{title === 'Our Collection' ? (
  <>
    <span className="collection-label">
      EXPLORE THE COLLECTION
    </span>

    <h2>The Fragrance Edit</h2>

    <p>
      A curated selection of scents worth remembering.
    </p>
  </>
) : (
  <>
    <h2>{title}</h2>

    <p>
      Discover our collection of premium fragrances.
    </p>
  </>
)}
{title === 'Our Collection' && (
  <>
{searchOpen && (
  <div className="shop-search">
    <input
      type="search"
      placeholder="Search perfumes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      aria-label="Search perfumes"
      autoFocus
    />

    <button
      type="button"
      className="shop-search-close"
      aria-label="Close search"
      onClick={() => {
        setSearch('')
        setSearchParams({})
      }}
    >
      ✕
    </button>
  </div>
)}
<div className="shop-category-buttons">
  {['All', 'Floral', 'Fresh', 'Woody'].map((item) => (
    <button
      key={item}
      type="button"
      className={`category-btn ${category === item ? 'active' : ''}`}
      onClick={() => setCategory(item)}
    >
      {item === 'All' ? 'All Fragrances' : item}
    </button>
  ))}
</div>
  </>
)}
        {loading && <p>Loading perfumes...</p>}
{error && <p>Error: {error.message}</p>}

        {!loading && !error && (
          <>
            {filteredProducts.length === 0 && (
              <p>No perfumes found.</p>
            )}
{title === 'Our Collection' && (
  <div className="shop-slider-arrows">
    <button
      type="button"
      aria-label="Previous perfumes"
      onClick={() =>
        sliderRef.current?.scrollBy({
          left: -320,
          behavior: 'smooth'
        })
      }
    >
      ←
    </button>

    <button
      type="button"
      aria-label="Next perfumes"
      onClick={() =>
        sliderRef.current?.scrollBy({
          left: 320,
          behavior: 'smooth'
        })
      }
    >
      →
    </button>
  </div>
)}
<div
  ref={sliderRef}
  className={title === 'Our Collection' ? 'shop-products-slider' : 'products-grid'}
>
              {filteredProducts.map((product) => {
                const startingPrice = Math.min(
                  ...product.sizes.map((item) => Number(item.price))
                )

                const inStock = product.sizes.some(
                  (item) => Number(item.stock) > 0
                )

                const imageName = product.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
return (
  <Link
    to={`/product/${product.id}`}
    className="product-card"
    key={product.id}
  >
                    <img
                      src={`/images/products/${imageName}.png`}
                      alt={`${product.name} perfume bottle`}
                      className="product-image"
                      loading="lazy"
                    />

                    <h3>{product.name}</h3>
                    <p>{product.category}</p>

                    <p>
                      Starting from Rs.{' '}
                      {startingPrice.toLocaleString()}
                    </p>

                    <p>
                      {inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
   </Link>              
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
