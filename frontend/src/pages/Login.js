import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import '../Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();
    const { email, password } = formData;

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setServerError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            setAuthToken(res.data.token);
            // Force reload to ensure App.js re-reads token from localStorage
            window.location.href = '/';
        } catch (err) {
            setServerError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1>Fast, Efficient and Productive</h1>
                    <p>
                        Manage your tasks with ease. Collaborate with your team and stay on top of your deadlines.
                        Experience the new way of productivity.
                    </p>
                </div>
            </div>


            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2>Sign In</h2>
                    <p className="auth-subtitle">Welcome back! Please enter your details.</p>

                    {serverError && <p style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '15px', background: '#fff8f8', padding: '10px', borderRadius: '8px' }}>{serverError}</p>}

                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="text"
                                placeholder="Enter your email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <div className="error-msg">{errors.email}</div>}
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    className={errors.password ? 'error' : ''}
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                            {errors.password && <div className="error-msg">{errors.password}</div>}
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up for free</Link>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;
