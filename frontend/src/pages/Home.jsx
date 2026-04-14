import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        localStorage.removeItem("token");

        // redirect to login
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Welcome to the Home Page!</h2>
            <p>You have successfully logged in.</p>

            <button
                onClick={handleLogout}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Home;
