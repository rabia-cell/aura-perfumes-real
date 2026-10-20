import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { supabase } from '../lib/supabase'
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
function AdminReports() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [salesPeriod, setSalesPeriod] = useState('daily')
const [selectedSalesDate, setSelectedSalesDate] = useState('')
  useEffect(() => {
    let active = true

    async function loadReports() {
      try {
        const { data, error: authError } =
          await supabase.auth.getSession()

        if (authError || !data.session) {
          throw new Error('Please login again.')
        }

        const [ordersResponse, productsResponse] =
          await Promise.all([
            fetch('http://localhost:3000/api/orders', {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`
              }
            }),
            fetch('http://localhost:3000/api/products')
          ])

        if (!ordersResponse.ok || !productsResponse.ok) {
          throw new Error('Could not load reports.')
        }

        const ordersData = await ordersResponse.json()
        const productsData = await productsResponse.json()

        if (active) {
          setOrders(ordersData)
          setProducts(productsData)
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReports()

    return () => {
      active = false
    }
  }, [])
  const totalOrders = orders.length

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  )

  const totalCustomers = new Set(
    orders
      .map((order) => order.email?.trim().toLowerCase())
      .filter(Boolean)
  ).size

  const availableStock = products.reduce(
    (sum, product) =>
      sum + (product.sizes || []).reduce(
        (stockSum, size) =>
          stockSum + Number(size.stock || 0),
        0
      ),
    0
  )
// Generate date options from first order to today
const validOrderDates = orders
  .map((order) => new Date(order.created_at))
  .filter((date) => !Number.isNaN(date.getTime()))

const firstOrderDate = validOrderDates.length
  ? new Date(Math.min(...validOrderDates.map((date) => date.getTime())))
  : new Date()

const salesDateOptions = []

const cursor = new Date(firstOrderDate)
const today = new Date()

if (salesPeriod === 'daily') {
  cursor.setHours(0, 0, 0, 0)
} else if (salesPeriod === 'monthly') {
  cursor.setDate(1)
  cursor.setHours(0, 0, 0, 0)
} else {
  cursor.setMonth(0, 1)
  cursor.setHours(0, 0, 0, 0)
}

while (cursor <= today) {
  const year = cursor.getFullYear()
  const month = String(cursor.getMonth() + 1).padStart(2, '0')
  const day = String(cursor.getDate()).padStart(2, '0')

  const value =
    salesPeriod === 'daily'
      ? `${year}-${month}-${day}`
      : salesPeriod === 'monthly'
        ? `${year}-${month}`
        : `${year}`

  const label =
    salesPeriod === 'daily'
      ? cursor.toLocaleDateString('en-GB')
      : salesPeriod === 'monthly'
        ? cursor.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
          })
        : `${year}`

  salesDateOptions.push({ value, label })

  if (salesPeriod === 'daily') {
    cursor.setDate(cursor.getDate() + 1)
  } else if (salesPeriod === 'monthly') {
    cursor.setMonth(cursor.getMonth() + 1)
  } else {
    cursor.setFullYear(cursor.getFullYear() + 1)
  }
}

salesDateOptions.reverse()
const salesByPeriod = orders.reduce((result, order) => {
  if (!order.created_at) return result

  const date = new Date(order.created_at)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  let key = `${year}-${month}-${day}`

  if (salesPeriod === 'monthly') {
    key = `${year}-${month}`
  }

  if (salesPeriod === 'yearly') {
    key = `${year}`
  }

  result[key] =
    (result[key] || 0) + Number(order.total || 0)

  return result
}, {})
const salesChartData = Object.entries(salesByPeriod)
  .filter(([date]) =>
    !selectedSalesDate || date === selectedSalesDate
  )
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, amount]) => ({
    date,
    amount
  }))
const perfumeSales = {}

orders.forEach((order) => {
  ;(order.items || []).forEach((item) => {
    const name = item.product_name
    if (!name) return

    if (!perfumeSales[name]) {
      perfumeSales[name] = {
        name,
        unitsSold: 0,
        totalValue: 0
      }
    }

    const quantity = Number(item.quantity || 0)
    const price = Number(item.price || 0)

    perfumeSales[name].unitsSold += quantity
    perfumeSales[name].totalValue += price * quantity
  })
})

const bestSellingPerfumes = Object.values(perfumeSales)
  .sort((a, b) => b.unitsSold - a.unitsSold)

const orderStatusCounts = orders.reduce((counts, order) => {
  const status = order.status || 'Pending'

  counts[status] = (counts[status] || 0) + 1

  return counts
}, {})

const orderStatusData = [
  'Pending',
  'Start Packing',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled'
].map((status) => ({
  status,
  count: orderStatusCounts[status] || 0
}))

const lowStockProducts = products.flatMap((product) =>
  (product.sizes || [])
    .filter((item) => Number(item.stock) <= 5)
    .map((item) => ({
      id: product.id,
      name: product.name,
      size: item.size,
      stock: Number(item.stock)
    }))
).sort((a, b) => a.stock - b.stock)

return (
  <main className="admin-dashboard-page admin-reports-page">
      <div className="admin-layout">
        <AdminSidebar />

        <section className="admin-content">
          <h1>Sales & Business Reports</h1>
          <p>
            Track your perfume sales, orders, customers
            and inventory performance.
          </p>

          {loading && <p>Loading reports...</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && (
<>
<div className="admin-reports-overview">
  <h2>Business Overview</h2>


<div className="admin-reports-cards">
  <div className="admin-report-card">
    <span>Total Order Value</span>
    <h3>Rs. {totalRevenue.toLocaleString()}</h3>
    <p>Value of all placed orders</p>
  </div>

  <div className="admin-report-card">
    <span>Total Orders</span>
    <h3>{totalOrders}</h3>
    <p>Customer orders received</p>
  </div>

  <div className="admin-report-card">
    <span>Total Customers</span>
    <h3>{totalCustomers}</h3>
    <p>Unique customer emails</p>
  </div>

  <div className="admin-report-card">
    <span>Available Stock</span>
    <h3>{availableStock}</h3>
    <p>Perfume units in inventory</p>
  </div>
</div>
<div className="admin-sales-chart">
<div className="admin-sales-chart-header">
  <div>
    <h2>Sales Performance</h2>
    <p>
      {salesPeriod === 'daily'
        ? 'Daily sales performance'
        : salesPeriod === 'monthly'
        ? 'Monthly sales performance'
        : 'Yearly sales performance'}
    </p>
  </div>
<div className="admin-sales-filters">
  {['daily', 'monthly', 'yearly'].map((period) => (
    <button
      key={period}
      type="button"
      className={salesPeriod === period ? 'active' : ''}
      onClick={() => {
        setSalesPeriod(period)
        setSelectedSalesDate('')
      }}
    >
      {period.charAt(0).toUpperCase() + period.slice(1)}
    </button>
  ))}
{salesPeriod === 'daily' ? (
  <input
    type="date"
    className="admin-sales-date-select"
    value={selectedSalesDate}
    min={
      firstOrderDate.getFullYear() + '-' +
      String(firstOrderDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(firstOrderDate.getDate()).padStart(2, '0')
    }
    max={
      new Date().getFullYear() + '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') + '-' +
      String(new Date().getDate()).padStart(2, '0')
    }
    onChange={(e) => setSelectedSalesDate(e.target.value)}
  />
) : (
  <select
    className="admin-sales-date-select"
    value={selectedSalesDate}
    onChange={(e) => setSelectedSalesDate(e.target.value)}
  >
    <option value="">
      {salesPeriod === 'monthly' ? 'All Months' : 'All Years'}
    </option>

    {salesDateOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)}
</div>
</div>
  {salesChartData.length === 0 ? (
    <p>No sales data available yet.</p>
  ) : (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={salesChartData}
          margin={{ top: 20, right: 25, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2d2bd"
          />

          <XAxis
            dataKey="date"
            stroke="#76583b"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#76583b"
            tick={{ fontSize: 12 }}
            width={65}
          />

          <Tooltip
            formatter={(value) => [
              `Rs. ${Number(value).toLocaleString()}`,
              'Order Value'
            ]}
            contentStyle={{
              background: '#fff8ef',
              border: '1px solid #d5b88b',
              borderRadius: '10px'
            }}
          />


          <Line
            type="monotone"
            dataKey="amount"
            stroke="#b88746"
            strokeWidth={3}
            dot={{ r: 5, fill: '#b88746' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
</div>

{/* Order Status Report */}
<div className="admin-order-status-report">
  <h2>Order Status Overview</h2>
  <p>Track the current progress of customer orders.</p>

  <div className="admin-order-status-grid">
    {orderStatusData.map((item) => (
      <div
        className="admin-order-status-card"
        key={item.status}
      >
        <span>{item.status}</span>
        <h3>{item.count}</h3>
        <p>Orders</p>
      </div>
    ))}
  </div>
</div>

{/* Low Stock Alerts */}
<div className="admin-low-stock-report">
  <h2>Inventory Alerts</h2>
  <p>Perfumes with 5 or fewer units remaining.</p>

  {lowStockProducts.length === 0 ? (
    <p>All perfumes have sufficient stock.</p>
  ) : (
    <div className="admin-low-stock-table-wrap">
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Perfume</th>
            <th>Size</th>
            <th>Remaining Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map((product) => (
            <tr key={`${product.id}-${product.size}`}>
              <td>
                <div className="admin-best-seller-product">
                  <img
                    src={`/images/products/${perfumeImages[product.name] || 'noor-oud.png'}`}
                    alt={product.name}
                  />
                  <strong>{product.name}</strong>
                </div>
              </td>
              <td>{product.size}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={
                    product.stock === 0
                      ? 'admin-inventory-badge out'
                      : 'admin-inventory-badge low'
                  }
                >
                  {product.stock === 0
                    ? 'Out of Stock'
                    : 'Low Stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

{/* Best-Selling Perfumes */}
<div className="admin-best-sellers">
  <h2>Best-Selling Perfumes</h2>
  <p>Perfume sales based on recorded order items.</p>

  {bestSellingPerfumes.length === 0 ? (
    <p>No perfume sales data available yet.</p>
  ) : (
    <div className="admin-best-sellers-table-wrap">
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Perfume</th>
            <th>Units Sold</th>
            <th>Total Order Value</th>
          </tr>
        </thead>

        <tbody>
          {bestSellingPerfumes.map((perfume, index) => (
            <tr key={perfume.name}>
              <td>#{index + 1}</td>
<td>
  <div className="admin-best-seller-product">
    <img
      src={`/images/products/${perfumeImages[perfume.name] || 'noor-oud.png'}`}
      alt={perfume.name}
    />
    <strong>{perfume.name}</strong>
  </div>
</td>              
              <td>{perfume.unitsSold}</td>
              <td>
                Rs. {perfume.totalValue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
  </div>

  </>
        )}
        </section>
      </div>
    </main>
  )
}

export default AdminReports
