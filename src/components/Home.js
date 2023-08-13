import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';

const Home = () => {
    const { auth } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await api.get('/auth/users/me/', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${auth.access}`,
                    },
                });
                setUserData(response.data);
                setLoading(false); // Mark loading as done
            } catch (error) {
                console.log(error);
                setLoading(true); // Mark loading as done even on error
            }
        };

        if (auth.access) {
            getUserData();
        }
        else{
            setLoading(true)
            navigate('/admin')
        }

    }, [auth.access],[]);

    const goToStartPage = async() =>{
        navigate('/')
    }

    const logout = () =>{

    }
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : userData ? (
                <><h1>Hello {userData.username}</h1><Logout /></>
            ) : (
                <p>No user data available</p>
            )}

           
        </div>
    );
};

export default Home;
