import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

// 🔹 Create inner component (needed for useNavigate)
function AppRoutes() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // ✅ Auto-login redirect (better way)
        if (token && window.location.pathname === "/login") {
            navigate("/home");
        }

        // ✅ LISTEN FOR LOGOUT (SSO FIX)
        const handleStorageChange = (event) => {
            if (event.key === "token" && !event.newValue) {
                navigate("/login");
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };

    }, [navigate]);

    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Route */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
