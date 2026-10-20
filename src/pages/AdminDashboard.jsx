import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import AdminSidebar from '../components/AdminSidebar'
import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

function AdminDashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://aura-backend-9nq5.onrender.com/api/products')

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      return response.json()
    }
  })

  const inStock = products.filter((product) =>
    product.sizes?.some((item) => Number(item.stock) > 0)
  ).length

  const outOfStock = products.length - inStock
const { data: orders = [] } = useQuery({
  queryKey: ['admin-orders'],
  queryFn: async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      throw new Error('Admin login required')
    }

    const response = await fetch('https://aura-backend-9nq5.onrender.com/api/orders', {
      headers: {
        Authorization: `Bearer ${data.session.access_token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to load orders')
    }

    return response.json()
  },
  staleTime: 30 * 1000
})
const weeklyOrders = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
].map((day, index) => {
  const today = new Date()
  const date = new Date(today)

  date.setDate(today.getDate() - (6 - index))

  const count = orders.filter((order) => {
    const orderDate = new Date(order.created_at)

    return orderDate.toDateString() === date.toDateString()
  }).length

  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    orders: count
  }
})
return (
    <main className="admin-dashboard-page">
      <div className="admin-layout">

<AdminSidebar />
<section className="admin-content">
  <h1>Dashboard</h1>
  <p>Welcome back! Here is an overview of your store.</p>

<div className="admin-stats">
  <div className="admin-stat-card">
    <p>Total Orders</p>
    <h2>{orders.length}</h2>
    <span>Orders received</span>
  </div>

  <div className="admin-stat-card">
    <p>Total Products</p>
    <h2>{products.length}</h2>
    <span>Products in store</span>
  </div>

  <div className="admin-stat-card">
    <p>In Stock</p>
    <h2>{inStock}</h2>
    <span>Products available</span>
  </div>

  <div className="admin-stat-card">
    <p>Out of Stock</p>
    <h2>{outOfStock}</h2>
    <span>Products unavailable</span>
  </div>
</div>
  {/* Orders Overview Chart */}
  <div className="admin-orders-overview">
    <h2>Orders Overview</h2>

    <div className="admin-orders-chart">
{weeklyOrders.map((item) => (
        <div className="admin-chart-column" key={item.day}>
          <div
            className="admin-chart-bar"
            style={{ height: `${item.orders * 12}px` }}
            title={`${item.orders} orders`}
          />
          <span>{item.day}</span>
        </div>
      ))}
    </div>
  </div>
{/* Stock Status */}
<div className="admin-stock-status">
  <h2>Stock Status</h2>
<div className="admin-stock-chart">
  <div
    className="admin-stock-circle"
    style={{
      background: `conic-gradient(
        #c9a15d 0% ${products.length ? (inStock / products.length) * 100 : 0}%,
        #6d4030 ${products.length ? (inStock / products.length) * 100 : 0}% 100%
      )`
    }}
  >
    <div className="admin-stock-circle-inner">
      <strong>{products.length}</strong>
      <span>Products</span>
    </div>
  </div>
</div>
  <div className="admin-stock-items">
<div className="admin-stock-item">
  <span>In Stock</span>
  <strong>{inStock}</strong>
</div>
  <div className="admin-stock-item">
    <span>Out of Stock</span>
    <strong>{outOfStock}</strong>
  </div>
</div>
</div>

{/* Top Trending Products */}
<div className="admin-trending-products">
  <div className="admin-trending-header">
    <h2>Top Trending Products</h2>
    <Link to="/admin/products">View All →</Link>
  </div>

  <div className="admin-trending-list">
    <div className="admin-trending-item">
      <span className="admin-trending-rank">01</span>
      <div>
        <h3>Noor Oud</h3>
        <p>Perfume Collection</p>
      </div>
      <span className="admin-trending-tag">Trending</span>
    </div>

    <div className="admin-trending-item">
      <span className="admin-trending-rank">02</span>
      <div>
        <h3>Rose Mirage</h3>
        <p>Perfume Collection</p>
      </div>
      <span className="admin-trending-tag">Trending</span>
    </div>
  </div>
</div>
{/* Latest Orders */}
<div className="admin-latest-orders">
  <div className="admin-trending-header">
    <h2>Latest Orders</h2>
    <Link to="/admin/orders">View All →</Link>
  </div>

  <div className="admin-orders-table-wrap">
    <table className="admin-orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.slice(0, 5).map((order) => (
          <tr key={order.id}>
            <td>#{order.id}</td>
            <td>{order.first_name} {order.last_name}</td>
            <td>
              {order.total == null
                ? '—'
                : `Rs. ${Number(order.total).toLocaleString()}`}
            </td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</section>
 </div>
    </main>
  )
}

export default AdminDashboard
