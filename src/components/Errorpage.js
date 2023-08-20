import React from 'react'
import { useNavigate } from 'react-router-dom';

const Errorpage = ({error}) => {
    const navigate = useNavigate();
    const handleGoToHome = (e)=>{
        e.preventDefault();
        navigate('/home')
    }
  return (
    <div>
      {error}
      <button onClick={handleGoToHome}>
        Go To Home
      </button>
    </div>

  )
}

export default Errorpage
