import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await axios.post('http://100.55.84.181:5000/login', {
                email,
                password
            });

            // No alert — just navigate
            navigate('/home');

        } catch (error) {
            console.error('Login error', error);

            // Show error in UI instead of alert
            setErrorMsg(
                error.response?.data?.error ||
                error.message ||
                'Login failed'
            );
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

            {/* Signup Option */}
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
