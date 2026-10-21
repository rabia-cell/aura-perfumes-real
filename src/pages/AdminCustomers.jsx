import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { supabase } from '../lib/supabase'

const perfumeImages = {
  'Noor Oud': 'noor-oud.webp',
  'Rose Mirage': 'rose-mirage.webp',
  'Citrine Coast': 'citrine-coast.webp',
  'Midnight Vetiver': 'midnight-vetiver.webp',
  'Jasmin Veil': 'jasmin-veil.webp',
  'Amber Dune': 'amber-dune.webp',
  'Cedar & Smoke': 'cedar-smoke.webp',
  'Blue Zephyr': 'blue-zephyr.webp'
}

function AdminCustomers() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    let active = true

    async function loadCustomers() {
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
          throw new Error('Could not load customers.')
        }

        const result = await response.json()
        if (active) setOrders(result)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCustomers()
    return () => { active = false }
  }, [])

  const customers = useMemo(() => {
    const grouped = new Map()

    orders.forEach((order) => {
      const email = (order.email || '').trim().toLowerCase()
      const key = email || `order-${order.id}`

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          name: `${order.first_name || ''} ${order.last_name || ''}`.trim(),
          email: order.email || '—',
          phone: order.phone || '—',
          city: order.city || '—',
          address: order.address || '—',
          orders: [],
          totalSpent: 0
        })
      }

      const customer = grouped.get(key)
      customer.orders.push(order)
      customer.totalSpent += Number(order.total) || 0
    })
return [...grouped.values()].sort(
  (a, b) =>
    Math.min(...a.orders.map(order => Number(order.id))) -
    Math.min(...b.orders.map(order => Number(order.id)))
)
  }, [orders])

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.email, customer.phone, customer.city]
      .some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )
  )

  const selected = customers.find(
    (customer) => customer.key === selectedCustomer
  )

  return (
    <main className="admin-dashboard-page admin-customers-page">
      <div className="admin-layout">
        <AdminSidebar />

        <section className="admin-content">
          <h1>Customers Management</h1>
          <p>View customer profiles, purchases and order history.</p>

          {loading && <p>Loading customers...</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && (
            <>
              <div className="admin-customers-toolbar">
                <input
                  type="search"
                  placeholder="Search customers by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span>{customers.length} Customers</span>
              </div>

              <div className="admin-customers-table-wrap">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
<th>No.</th>                      
<th>Customer</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
{filteredCustomers.map((customer, index) => (            
                      <tr key={customer.key}>
<td>{index + 1}</td>
                        <td>
                          <strong>{customer.name}</strong>
                          <div>{customer.email}</div>
                        </td>
                        <td>{customer.phone}</td>
                        <td>{customer.city}</td>
                        <td>{customer.orders.length}</td>
                        <td>
                          Rs. {customer.totalSpent.toLocaleString()}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCustomer(customer.key)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <p>No customers found.</p>
                )}
              </div>

              {selected && (
                <section className="admin-customer-details">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    ← Back to Customers
                  </button>

                  <h2>{selected.name}</h2>
                  <p><strong>Email:</strong> {selected.email}</p>
                  <p><strong>Phone:</strong> {selected.phone}</p>
                  <p><strong>City:</strong> {selected.city}</p>
                  <p><strong>Address:</strong> {selected.address}</p>
                  <p><strong>Total Orders:</strong> {selected.orders.length}</p>
                  <p>
                    <strong>Total Spent:</strong> Rs.{' '}
                    {selected.totalSpent.toLocaleString()}
                  </p>

                  <h3>Order History</h3>

                  {selected.orders.map((order) => (
                    <article
                      key={order.id}
                      className="admin-customer-order"
                    >
                      <h4>Order #{order.id}</h4>
                      <p>
                        {new Date(order.created_at).toLocaleDateString()}
                        {' · '}{order.status}
                        {' · '}Rs. {Number(order.total || 0).toLocaleString()}
                      </p>

                      {(order.items || []).length === 0 && (
                        <p>No product details available.</p>
                      )}

                      {(order.items || []).map((item, index) => {
                        const filename = perfumeImages[item.product_name]

                        return (
                          <div
                            className="admin-customer-product"
                            key={`${order.id}-${index}`}
                          >
                            {filename && (
                              <img
                                src={`/aura-perfumes-real/images/products/${filename}`}
                                alt={item.product_name}
                                width="80"
                                height="80"
                                loading="lazy"
                              />
                            )}
                            <div>
                              <strong>{item.product_name}</strong>
                              <p>
                                Size: {item.size} · Qty: {item.quantity}
                              </p>
                              <p>
                                Rs. {Number(item.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </article>
                  ))}
                </section>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminCustomers
