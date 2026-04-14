import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // 🔹 Normal login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const res = await axios.post('http://100.55.84.181:5000/login', {
                email,
                password
            });

            // ✅ STORE TOKEN (IMPORTANT)
            localStorage.setItem("token", res.data.token);

            navigate('/home');

        } catch (error) {
            console.error('Login error', error);

            setErrorMsg(
                error.response?.data?.error ||
                error.message ||
                'Login failed'
            );
        }
    };

    // 🔹 Google login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(
                'http://100.55.84.181:5000/auth/google',
                { token: credentialResponse.credential }
            );

            // ✅ STORE TOKEN
            localStorage.setItem("token", res.data.token);

            navigate('/home');

        } catch (error) {
            console.error('Google login error', error);
            setErrorMsg('Google login failed');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Login</h2>

            {/* Error Message */}
            {errorMsg && (
                <p style={{ color: 'red', marginBottom: '10px' }}>
                    {errorMsg}
                </p>
            )}

            {/* 🔹 Normal Login */}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px' }}>
                    Login
                </button>
            </form>

            {/* 🔹 Divider */}
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <p>OR</p>
            </div>

            {/* 🔹 Google Login */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMsg('Google login failed')}
                />
            </div>

            {/* 🔹 Signup Option */}
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Not registered?{' '}
                <Link to="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;
