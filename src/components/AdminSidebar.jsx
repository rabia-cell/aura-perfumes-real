import { Link, NavLink } from 'react-router-dom'

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>AURA</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard">
          ◇ Dashboard
        </NavLink>

        <NavLink to="/admin/orders">
          ▣ Orders
        </NavLink>

        <NavLink to="/admin/products">
          ◇ Products
        </NavLink>

        <NavLink to="/admin/customers">
          ♙ Customers
        </NavLink>

        <NavLink to="/admin/reports">
          ▥ Reports
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <Link to="/">↗ View Store</Link>
        <Link to="/admin/login">← Logout</Link>
      </div>
    </aside>
  )
}

export default AdminSidebar
