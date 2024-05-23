import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

const UserAccount = ({ user, token }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete_account/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/signup");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.fullName}!</h2>
          <p>Your email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </button>

          {isDeleteModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close-button"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  &times;
                </span>
                <p>Are you sure you want to delete your account?</p>
                <button onClick={handleDeleteAccount}>
                  Yes, delete my account
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserAccount;
