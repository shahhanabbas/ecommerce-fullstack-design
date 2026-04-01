import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
	const { id } = useParams();
	const { products, loading } = useProducts();
	const { addToCart } = useCart();
	const [quantity, setQuantity] = useState(1);
	const [added, setAdded] = useState(false);

	const product = useMemo(() => products.find(item => String(item.id) === String(id)), [products, id]);

	if (loading) {
		return <div className="page-shell page-feedback">Loading product details...</div>;
	}

	if (!product) {
		return (
			<div className="page-shell">
				<section className="empty-panel">
					Product not found. <Link to="/products">Browse all products</Link>
				</section>
			</div>
		);
	}

	const handleAdd = () => {
		addToCart(product, quantity);
		setAdded(true);
		window.setTimeout(() => setAdded(false), 1600);
	};

	return (
		<div className="page-shell">
			<article className="details-card">
				<img src={product.image} alt={product.title} className="details-image" />
				<div>
					<p className="details-meta">Category: {product.category}</p>
					<h1 className="details-title">{product.title}</h1>
					<p className="details-description">{product.description}</p>
					<p className="details-price">${product.price.toFixed(2)}</p>

					<div className="details-qty-row">
						<label htmlFor="qty-input">Qty</label>
						<input
							id="qty-input"
							className="details-qty-input"
							type="number"
							min="1"
							value={quantity}
							onChange={event => setQuantity(Math.max(1, Number(event.target.value) || 1))}
						/>
					</div>

					<button type="button" className="button button-success" onClick={handleAdd}>
						Add to Cart
					</button>

					{added && <p className="cart-toast">Added to cart</p>}
				</div>
			</article>
		</div>
	);
}
