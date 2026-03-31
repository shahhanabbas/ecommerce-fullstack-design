import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

export default function ProductListing() {
	const { products, loading, error } = useProducts();
	const [search, setSearch] = useState('');

	const filteredProducts = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return products;

		return products.filter(
			product =>
				product.title.toLowerCase().includes(query) ||
				product.category.toLowerCase().includes(query)
		);
	}, [products, search]);

	if (loading) {
		return <div className="page-shell page-feedback">Loading catalog...</div>;
	}

	return (
		<div className="page-shell">
			<section className="search-panel">
				<div className="section-head">
					<h1 className="section-title">All Products</h1>
					<p className="section-caption">Find what matches your style.</p>
				</div>
				<input
					type="text"
					className="search-input"
					placeholder="Search by title or category"
					value={search}
					onChange={event => setSearch(event.target.value)}
				/>
				{error && <p className="section-caption">{error}</p>}
			</section>

			{filteredProducts.length === 0 ? (
				<section className="empty-panel">No products found for this search.</section>
			) : (
				<section className="product-grid">
					{filteredProducts.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</section>
			)}
		</div>
	);
}
