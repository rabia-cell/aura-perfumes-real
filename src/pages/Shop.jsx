import FeaturedProducts from '../components/FeaturedProducts'

function Shop() {
  return (
    <main className="shop-page">

      {/* SHOP HERO SECTION */}
      <section className="shop-luxury-hero">
        <div className="shop-hero-text">
          <span className="shop-hero-label">
            AURA PERFUMES · LUXURY FRAGRANCES
          </span>

          <h1>Discover Your Signature Scent</h1>

          <p>
            Explore timeless fragrances crafted for every mood,
            moment, and personality.
          </p>
        </div>

        <div className="shop-hero-image">
          <img
src="/images/shop-hero.png"            
            alt="Aura Perfumes luxury fragrance collection"
          />
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <FeaturedProducts title="Our Collection" />

    </main>
  )
}

export default Shop
