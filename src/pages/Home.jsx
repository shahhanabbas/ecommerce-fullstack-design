import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products, loading, error } = useProducts();

  if (loading) return <div className="page-shell page-feedback">Loading products...</div>;

  const featured = products.slice(0, 4);

  return (
    <div className="page-shell">
      <div className="hero-card">
        <div className="hero-orb hero-orb-right"></div>
        <div className="hero-orb hero-orb-left"></div>
        <div className="hero-content">
          <p className="hero-kicker">LIMITED EDITION</p>
          <h1 className="hero-title">Welcome to AsterStore</h1>
          <p className="hero-subtitle">Discover amazing products at great prices</p>
          <button className="button-primary">Shop Now</button>
        </div>
      </div>

      <div className="section-block">
        <div className="section-head">
          <h2 className="section-title">Featured Products</h2>
        </div>
        {error && <p className="section-caption">{error}</p>}
        <div className="product-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}