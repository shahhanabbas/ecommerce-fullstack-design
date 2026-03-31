import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async event => {
		event.preventDefault();
		setError('');

		try {
			await signup({ name, email, password });
			navigate('/');
		} catch (err) {
			setError(err.message || 'Unable to signup.');
		}
	};

	return (
		<div className="page-shell auth-page">
			<section className="auth-card">
				<h1>Create Account</h1>
				{error && <div className="form-error">{error}</div>}
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							className="form-input"
							type="text"
							value={name}
							onChange={event => setName(event.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							className="form-input"
							type="email"
							value={email}
							onChange={event => setEmail(event.target.value)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							className="form-input"
							type="password"
							value={password}
							onChange={event => setPassword(event.target.value)}
							required
						/>
					</div>
					<button type="submit" className="button button-primary auth-submit">
						Sign Up
					</button>
				</form>
				<p className="auth-switch">
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</section>
		</div>
	);
}
