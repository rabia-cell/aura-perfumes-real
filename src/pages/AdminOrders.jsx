import AdminSidebar from '../components/AdminSidebar'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadOrders() {
      try {
        const { data, error: authError } =
          await supabase.auth.getSession()

        if (authError || !data.session) {
          throw new Error('Please login again.')
        }

        const response = await fetch(
          'https://aura-backend-9nq5.onrender.com/api/orders',
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load orders')
        }

        const result = await response.json()

        if (active) {
          setOrders(result)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Could not load orders.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [])

  async function updateOrderStatus(order, newStatus) {
    try {
      const { data, error: authError } =
        await supabase.auth.getSession()

      if (authError || !data.session) {
        throw new Error('Please login again.')
      }

      const response = await fetch(
        `https://aura-backend-9nq5.onrender.com/api/orders/${order.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.session.access_token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item.id === order.id
            ? { ...item, status: newStatus }
            : item
        )
      )
    } catch (err) {
      console.error('Order status update error:', err)
      alert(err.message || 'Could not update order status.')
    }
  }

  return (
    <main className="admin-dashboard-page admin-orders-page">
      <div className="admin-layout">
        <AdminSidebar />

        <section className="admin-content">
          <h1>Orders Management</h1>
          <p>View and manage customer orders.</p>

          {loading && <p>Loading orders...</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && (
            <div className="admin-orders-table-wrap">
              <table className="admin-orders-table">
                <thead>
                  <tr>
<th>No.</th>                    
<th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {[...orders]
                    .sort((a, b) => Number(a.id) - Number(b.id))
.map((order, index) => (            
                      <tr key={order.id}>
<td>{index + 1}</td>                      
  <td>#{order.id}</td>

                        <td>
                          {order.first_name} {order.last_name}
                        </td>

                        <td>
                          {(order.items || []).length
                            ? order.items.map((item, index) => (
                                <div key={index}>
                                  {item.product_name} ({item.size})
                                  {' × '}{item.quantity}
                                </div>
                              ))
                            : 'No items'}
                        </td>

                        <td>
                          {order.total == null
                            ? '—'
                            : `Rs. ${Number(order.total).toLocaleString()}`}
                        </td>

                        <td>
                          <select
                            className="admin-order-status"
                            value={order.status || 'Pending'}
                            onChange={(e) =>
                              updateOrderStatus(order, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Start Packing">Start Packing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {orders.length === 0 && <p>No orders found.</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminOrders

