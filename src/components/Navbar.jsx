import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function getNavClass({ isActive }) {
	return isActive ? 'nav-link is-active' : 'nav-link';
}

export default function Navbar() {
	const { cartCount } = useCart();
	const { isAuthenticated, isAdmin, user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<header className="site-header">
			<div className="nav-shell">
				<NavLink to="/" className="brand-mark">
					Aster<span className="brand-mark-accent">Store</span>
				</NavLink>

				<nav className="nav-menu">
					<NavLink to="/" className={getNavClass} end>
						Home
					</NavLink>
					<NavLink to="/products" className={getNavClass}>
						Products
					</NavLink>
					<NavLink to="/cart" className={getNavClass}>
						<span className="cart-link-wrap">
							Cart
							<span className="cart-badge">{cartCount}</span>
						</span>
					</NavLink>
					{isAdmin && (
						<NavLink to="/admin" className={getNavClass}>
							Admin
						</NavLink>
					)}
				</nav>

				{isAuthenticated ? (
					<button type="button" className="nav-button" onClick={handleLogout}>
						Logout {user?.name ? `(${user.name})` : ''}
					</button>
				) : (
					<NavLink to="/login" className="nav-button">
						Login
					</NavLink>
				)}
			</div>
		</header>
	);
}
