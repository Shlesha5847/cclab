import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const response = await axios.post(
                'http://100.55.84.181:5000/signup',
                { name, email, password }
            );

            // Show success message instead of alert
            setSuccessMsg(response.data.message || 'Signup successful!');

            // Redirect after short delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error('Signup error', error);

            setErrorMsg(
                error.response?.data?.error ||
                error.message ||
                'Signup failed'
            );
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Signup</h2>

            {/* Error Message */}
            {errorMsg && (
                <p style={{ color: 'red', marginBottom: '10px' }}>
                    {errorMsg}
                </p>
            )}

            {/* Success Message */}
            {successMsg && (
                <p style={{ color: 'green', marginBottom: '10px' }}>
                    {successMsg}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

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
                    Signup
                </button>
            </form>

            {/* Login Option */}
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Signup;
