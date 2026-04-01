import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'shop_user';

function getSavedUser() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(getSavedUser);

	const login = async (email, password) => {
		if (!email || !password) {
			throw new Error('Email and password are required.');
		}

		const normalizedEmail = email.trim().toLowerCase();
		const isAdmin = normalizedEmail === 'admin@shoplogo.com' && password === 'admin123';

		const nextUser = {
			email: normalizedEmail,
			name: normalizedEmail.split('@')[0],
			role: isAdmin ? 'admin' : 'customer',
		};

		setUser(nextUser);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
		return nextUser;
	};

	const signup = async ({ name, email, password }) => {
		if (!name?.trim() || !email?.trim() || !password?.trim()) {
			throw new Error('All fields are required.');
		}

		const nextUser = {
			email: email.trim().toLowerCase(),
			name: name.trim(),
			role: 'customer',
		};

		setUser(nextUser);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
		return nextUser;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem(STORAGE_KEY);
	};

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			isAdmin: user?.role === 'admin',
			login,
			signup,
			logout,
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider.');
	}
	return context;
}
