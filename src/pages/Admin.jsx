import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function Admin() {
	const { products, loading, error } = useProducts();

	const stats = useMemo(() => {
		const totalValue = products.reduce((sum, product) => sum + product.price, 0);
		return {
			count: products.length,
			avgPrice: products.length ? totalValue / products.length : 0,
		};
	}, [products]);

	if (loading) {
		return <div className="page-shell page-feedback">Loading admin dashboard...</div>;
	}

	return (
		<div className="page-shell admin-page">
			<section className="admin-card">
				<h2>Admin Dashboard</h2>
				<p className="section-caption">Manage and review product catalog data.</p>
				{error && <p className="section-caption">{error}</p>}
				<div className="summary-row">
					<span>Total Products</span>
					<strong>{stats.count}</strong>
				</div>
				<div className="summary-row">
					<span>Average Price</span>
					<strong>${stats.avgPrice.toFixed(2)}</strong>
				</div>
			</section>

			<section className="admin-card table-wrap">
				<table className="admin-table">
					<thead>
						<tr>
							<th>Product</th>
							<th>Category</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{products.map(product => (
							<tr key={product.id}>
								<td>{product.title}</td>
								<td>{product.category}</td>
								<td>${product.price.toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}
