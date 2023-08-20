import React, { useContext, useEffect, useState } from "react";
import AuthContext, { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Logout from "./Logout";
import VideoApp from "../VideoApp";
import generateUniqueCode from "./GenerateUniqueCode";

const Home = () => {
  const { auth } = useAuth();
  const [lobbyName, setLobbyName] = useState("");
  const navigate = useNavigate();
  const { userData, loading } = useContext(AuthContext);

  const handleSubmitJoin = (e) => {
    e.preventDefault(); // Prevent the form from submitting by default

    if (lobbyName.trim() === "") {
      // Check if the lobbyName is empty or contains only whitespace
      alert("Lobby name cannot be empty");
    } else {
      // Proceed with your form submission logic
      // You can navigate to the desired URL or perform other actions here
      navigate(`/videochat/${lobbyName}`);
    }
  };

  const handleSubmitCreate =() =>{
    console.log('create')
    const code = generateUniqueCode();
    console.log(code)
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <h1>Hello {userData.username}</h1>
          <Logout />
          {/* <form onSubmit={handleSubmit}> */}
          <button type="submit" onClick={handleSubmitCreate}>
            Create
          </button>
          <br />
          {/* <label htmlFor="Lobby-name">Lobby name</label> */}
          <input
            type="text"
            required
            autoFocus
            placeholder="Lobby-code"
            id="Lobby name"
            autoComplete="off"
            onChange={(e) => setLobbyName(e.target.value)}
            value={lobbyName}
          />
          <button type="submit" onClick={handleSubmitJoin}>
            Join
          </button>
          {/* </form> */}
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Home;
