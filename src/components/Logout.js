import React from 'react';
import { useAuth } from '../context/AuthProvider';

const Logout = () => {
    const { clearAuth } = useAuth();

    const handleLogout = () => {
        // Call the clearAuth function to remove tokens from cookies
        clearAuth();
        // Redirect the user to the login page or any other appropriate page
        window.location.href = '/login'; // Change the URL as needed
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
