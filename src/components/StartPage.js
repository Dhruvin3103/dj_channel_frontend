import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
    const navigate = useNavigate();
    
    const onBtnSubmit = (url) => {
        console.log('submit');
        navigate("/" + url);
    };
    
    return (
        <div>
            <h1>Welcome !!</h1>
            <button type='button' onClick={() => onBtnSubmit('signup')}>
                Sign up
            </button>
            <br />
            <button onClick={() => onBtnSubmit('login')}>
                Login
            </button>
        </div>
    );
};

export default StartPage;
