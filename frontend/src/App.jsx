import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {

    // 🔹 Auto-login (SSO)
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && window.location.pathname === "/login") {
            window.location.href = "/home";
        }
    }, []);

    return (
        <Router>
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

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />

            </Routes>
        </Router>
    );
}

export default App;
