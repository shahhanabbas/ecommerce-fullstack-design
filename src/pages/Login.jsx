import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const from = location.state?.from?.pathname || '/';

	const handleSubmit = async event => {
		event.preventDefault();
		setError('');

		try {
			await login(email, password);
			navigate(from, { replace: true });
		} catch (err) {
			setError(err.message || 'Unable to login.');
		}
	};

	return (
		<div className="page-shell auth-page">
			<section className="auth-card">
				<h1>Login</h1>
				{error && <div className="form-error">{error}</div>}
				<form className="auth-form" onSubmit={handleSubmit}>
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
						Login
					</button>
				</form>
				<p className="auth-switch">
					New user? <Link to="/signup">Create an account</Link>
				</p>
			</section>
		</div>
	);
}
