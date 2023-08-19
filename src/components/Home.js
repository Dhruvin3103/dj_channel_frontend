import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate,Link } from "react-router-dom";
import Logout from "./Logout";
import VideoApp from "../VideoApp";

const Home = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [lobbyName, setLobbyName] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  useEffect(() => {
    const getUserData = async () => {
      console.log(auth.access);
      try {
        console.log(auth.access);
        const response = await api.get("/auth/users/me/", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.access}`,
          },
        });
        setUserData(response.data);
        setLoading(false); // Mark loading as done
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (auth.access) {
      getUserData();
    }
  }, [auth.access]);

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
