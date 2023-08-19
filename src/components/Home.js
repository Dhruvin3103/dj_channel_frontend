import React, { useContext, useEffect, useState } from "react";
import AuthContext, { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate,Link } from "react-router-dom";
import Logout from "./Logout";
import VideoApp from "../VideoApp";

const Home = () => {
  const { auth } = useAuth();
  const [lobbyName, setLobbyName] = useState('');
  const navigate = useNavigate();
  const {userData,loading} = useContext(AuthContext)
  const handleSubmit =()=>{

  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <h1>Hello {userData.username}</h1>
          <Logout />
            <form onSubmit={handleSubmit}>
                <label htmlFor="Lobby-name">Lobby name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    id="Lobby name"
                    autoComplete="off"
                    onChange={(e) => setLobbyName(e.target.value)}
                    value={lobbyName}
                />
                <Link to={`/videochat/${lobbyName}`}>
                  <button>Join</button>
                </Link>
                
            </form>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Home;
