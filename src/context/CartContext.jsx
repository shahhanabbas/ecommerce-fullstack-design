import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'shop_cart';

function getSavedCart() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState(getSavedCart);

	const persist = nextItems => {
		setCartItems(nextItems);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
	};

	const addToCart = (product, quantity = 1) => {
		const qty = Math.max(1, Number(quantity) || 1);
		const existing = cartItems.find(item => item.id === product.id);

		if (existing) {
			updateQuantity(product.id, existing.quantity + qty);
			return;
		}

		persist([...cartItems, { ...product, quantity: qty }]);
	};

	const updateQuantity = (productId, quantity) => {
		const qty = Math.max(1, Number(quantity) || 1);
		const nextItems = cartItems.map(item =>
			item.id === productId ? { ...item, quantity: qty } : item
		);
		persist(nextItems);
	};

	const removeFromCart = productId => {
		persist(cartItems.filter(item => item.id !== productId));
	};

	const clearCart = () => {
		persist([]);
	};

	const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const value = useMemo(
		() => ({
			cartItems,
			cartCount,
			subtotal,
			addToCart,
			updateQuantity,
			removeFromCart,
			clearCart,
		}),
		[cartItems, cartCount, subtotal]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within CartProvider.');
	}
	return context;
}
