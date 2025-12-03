import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();
    const { email, password, confirmPassword } = formData;

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            await api.post('/auth/signup', { email, password });
            navigate('/login');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
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
                        Join thousands of users who are already managing their tasks more efficiently.
                        Get started for free today.
                    </p>
                </div>
            </div>


            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2>Sign Up</h2>
                    <p className="auth-subtitle">Create your account to get started.</p>

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
                                    placeholder="Create a password"
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

                        <div className="input-group">
                            <label>Repeat Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms">I accept the Terms</label>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>



                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Signup;
