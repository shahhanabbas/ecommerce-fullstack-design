import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
	const { addToCart } = useCart();

	return (
		<article className="product-card">
			<Link to={`/products/${product.id}`} className="product-card-media-wrap">
				<img src={product.image} alt={product.title} className="product-card-media" />
				<span className="product-card-category">{product.category}</span>
			</Link>

			<div className="product-card-body">
				<h3 className="product-card-title">{product.title}</h3>
				<p className="product-card-price">${product.price.toFixed(2)}</p>

				<button
					type="button"
					className="button button-primary product-card-btn"
					onClick={() => addToCart(product, 1)}
				>
					Add to Cart
				</button>
			</div>
		</article>
	);
}
