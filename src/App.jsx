import { lazy, Suspense, useState } from 'react'
import AdminCustomers from './pages/AdminCustomers'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Checkout from './pages/Checkout'
import Footer from './components/Footer'
import Cart from './pages/Cart'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import FeaturedProducts from './components/FeaturedProducts'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import './App.css'
const AdminReports = lazy(() => import('./pages/AdminReports'))
function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">
            THE ART OF FINE FRAGRANCE
          </p>

          <h1>
            Scent that arrives
            <span> before you do.</span>
          </h1>

          <p className="hero-description">
            Small-batch eau de parfum, composed with rare oud,
            Taif rose and Mediterranean citrus.
            Made to be remembered.
          </p>

          <Link to="/shop" className="hero-button">
            Shop Fragrances →
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-perfume.png"
            alt="Aura Perfumes luxury fragrance"
          />
        </div>
      </section>

      <FeaturedProducts />
    </main>
  )
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
const location = useLocation()
const isAdminPage = location.pathname.startsWith('/admin')
  return (
    <div className="aura-page">
{!isAdminPage && (
  <Header onOpenCart={() => setIsCartOpen(true)} />
)}
<Suspense fallback={<p className="loading-message">Loading page...</p>}>
  <Routes>
    <Route path="/" element={<Home />} />  
  <Route path="/shop" element={<Shop />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />

  <Route
    path="/product/:id"
    element={<ProductDetails onOpenCart={() => setIsCartOpen(true)} />}
  />

  <Route path="/checkout" element={<Checkout />} />
<Route path="/admin/login" element={<AdminLogin />} />

<Route element={<ProtectedRoute />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/orders" element={<AdminOrders />} />
  <Route path="/admin/products" element={<AdminProducts />} />
<Route path="/admin/customers" element={<AdminCustomers />} />
<Route path="/admin/reports" element={<AdminReports />} />
</Route>
  </Routes>
</Suspense>
{!isAdminPage && <Footer />}
      {isCartOpen && (
        <Cart onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  )
}
export default App
