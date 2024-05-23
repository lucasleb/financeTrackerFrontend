import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";
import UserAccount from "./UserAccount";
import UserGroups from "./UserGroups";

const Main = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching user data.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <UserAccount user={user} token={token} />
      <UserGroups user={user} token={token} />
    </div>
  );
};

export default Main;
