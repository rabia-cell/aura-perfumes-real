import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'

const perfumeImages = {
  'Noor Oud': 'noor-oud.png',
  'Rose Mirage': 'rose-mirage.png',
  'Citrine Coast': 'citrine-coast.png',
  'Midnight Vetiver': 'midnight-vetiver.png',
  'Jasmin Veil': 'jasmin-veil.png',
  'Amber Dune': 'amber-dune.png',
  'Cedar & Smoke': 'cedar-smoke.png',
  'Blue Zephyr': 'blue-zephyr.png'
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load products.')
        setLoading(false)
      })
  }, [])

  return (
    <main className="admin-dashboard-page">
      <div className="admin-layout">
        <AdminSidebar />

        <section className="admin-content">
          <h1>Products Management</h1>
          <p>Manage your perfume collection, prices and stock.</p>

          {loading && <p>Loading products...</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && (
            <div className="admin-products-table-wrap">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.flatMap((product) =>
                    (product.sizes || []).map((item, index) => (
                      <tr key={`${product.id}-${index}`}>
<td>
  {index === 0 && (
    <div className="admin-product-info">
      <img
        src={`/images/products/${perfumeImages[product.name]}`}
        alt={product.name}
        className="admin-product-image"
      />
      <span>{product.name}</span>
    </div>
  )}
</td>
<td>{index === 0 ? (product.category || 'Perfume') : ''}</td>                        
                        <td>{item.size}</td>
                        <td>
                          Rs. {Number(item.price).toLocaleString()}
                        </td>
<td>
  <input
    type="number"
    min="0"
    defaultValue={item.stock}
    className="admin-stock-input"
    id={`stock-${product.id}-${index}`}
  />

  <button
    type="button"
    onClick={async () => {
      const input = document.getElementById(
        `stock-${product.id}-${index}`
      )

      const stock = Number(input.value)

      if (
        input.value.trim() === '' ||
        !Number.isInteger(stock) ||
        stock < 0
      ) {
        alert('Please enter a valid stock quantity.')
        return
      }

      try {
const { data, error: authError } =
  await supabase.auth.getSession()

if (authError || !data.session) {
  throw new Error('Please login again.')
}
        const response = await fetch(
          'http://localhost:3000/api/admin/products/stock',
          {
            method: 'PATCH',
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${data.session.access_token}`
},
            body: JSON.stringify({
              product_id: Number(product.id),
              size: item.size,
              stock
            })
          }
        )

        if (!response.ok) {
          throw new Error('Stock update failed')
        }

        alert('Stock updated successfully!')
        window.location.reload()
      } catch (error) {
        alert('Could not update stock.')
      }
    }}
  >
    Save
  </button>
</td>                        
<td>
  <span
    className={
      Number(item.stock) > 0
        ? 'admin-stock-badge in-stock'
        : 'admin-stock-badge out-of-stock'
    }
  >
    {Number(item.stock) > 0
      ? 'In Stock'
      : 'Out of Stock'}
  </span>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {products.length === 0 && <p>No products found.</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminProducts
