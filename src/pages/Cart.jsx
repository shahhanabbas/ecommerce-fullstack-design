import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
	const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

	if (cartItems.length === 0) {
		return (
			<div className="page-shell">
				<section className="empty-cart-panel">
					<h1>Your cart is empty</h1>
					<p>Add products to continue shopping.</p>
					<Link className="button button-primary" to="/products">
						Browse Products
					</Link>
				</section>
			</div>
		);
	}

	const shipping = subtotal > 150 ? 0 : 8.99;
	const total = subtotal + shipping;

	return (
		<div className="page-shell cart-layout">
			<section className="cart-items">
				{cartItems.map(item => (
					<article key={item.id} className="cart-item">
						<img src={item.image} alt={item.title} className="cart-item-image" />
						<div className="cart-item-info">
							<h3>{item.title}</h3>
							<p>${item.price.toFixed(2)} each</p>
						</div>

						<div className="cart-qty-wrap">
							<button
								type="button"
								className="qty-btn"
								onClick={() => updateQuantity(item.id, item.quantity - 1)}
							>
								-
							</button>
							<span className="qty-value">{item.quantity}</span>
							<button
								type="button"
								className="qty-btn"
								onClick={() => updateQuantity(item.id, item.quantity + 1)}
							>
								+
							</button>
						</div>

						<div className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</div>

						<button type="button" className="remove-btn" onClick={() => removeFromCart(item.id)}>
							Remove
						</button>
					</article>
				))}
			</section>

			<aside className="summary-card">
				<h2>Order Summary</h2>
				<div className="summary-row">
					<span>Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="summary-row">
					<span>Shipping</span>
					<span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
				</div>
				<div className="summary-row summary-total">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<button type="button" className="button button-dark summary-btn" onClick={clearCart}>
					Place Demo Order
				</button>
			</aside>
		</div>
	);
}
