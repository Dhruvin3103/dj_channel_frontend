import React, { useContext, useEffect, useState } from "react";
import AuthContext, { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Logout from "./Logout";
import VideoApp from "../VideoApp";
import generateUniqueCode from "./GenerateUniqueCode";
import axios from "../api/axios";

const Home = () => {
  const { auth } = useAuth();
  const { userData, loading } = useContext(AuthContext);
  const [lobbyName, setLobbyName] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmitJoin = async (lobby_code) => {
    if (lobbyName.trim() === "") {
      alert("Lobby name cannot be empty");
    } else {
      const formData = new FormData();
      formData.append("lobby_id", lobby_code);
      try {
        const response = await axios.post("/chat/lobbycheck/", formData, {
          withCredentials: true,
        });
        navigate(`/videochat/${lobbyName}`);
        console.log("pass", response);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          console.log(status);
          if (status === 404) {
            setErr(data.error);
          }
        } else {
          setErr("An Error Occured");
          console.log(error);
        }
      }
    }
  };

  const handleSubmitCreate = async () => {
    console.log("create");
    const code = generateUniqueCode();
    const formData = new FormData();
    formData.append("lobby_id", code);
    try {
      const response = await axios.post("/chat/lobby/", formData, {
        withCredentials: true,
      });
      if (response.data["message"] === "Go ahead") {
        setTimeout(() => {
          navigate(`/videochat/${code}`);
        }, 0);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log(status);
        if (status === 400) {
          setErr(data.errors);
        }
      } else {
        setErr("An Error Occured");
        console.log(error);
      }
    }
    console.log(code);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          {err ? <p>{err}</p> : null}
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
          <button type="submit" onClick={() => handleSubmitJoin(lobbyName)}>
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
