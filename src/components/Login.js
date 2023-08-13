import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthProvider';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const [pwd, setPwd] = useState('');
    const [user, setUser] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('password', pwd);
        formData.append('username', user);

        try {
            const response = await axios.post('/auth/jwt/create/', formData, { withCredentials: true });
            // console.log(response.data.access);   
            setAuth(response.data.access, response.data.refresh);
            // No need to store token here, since cookies will be handled by browser
            navigate('/home');
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                console.log(status);
                if (status === 401) {
                    setErrMsg(data.detail);
                }
            } else {
                setErrMsg('An error occurred.');
                console.error(error);
            }
        }
    };

    const onBtnClick = () => {
        navigate('/signup');
    };

    return (
        <section>
            <p className={errMsg ? 'errMsg' : 'offscreen'} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    required
                    autoFocus
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    required
                    id="password"
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                />
                <button disabled={!user || !pwd}>Sign In</button>
            </form>
            <p>
                Do not have an Account?{' '}
                <span className="line signup-link" onClick={onBtnClick}>
                    Sign Up
                </span>
            </p>
        </section>
    );
};

export default Login;
