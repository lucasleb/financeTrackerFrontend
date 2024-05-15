import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [user, setUser] = useState(null);
  const [usergroups, setUsergroups] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const groupNameRef = useRef();
  const token = localStorage.getItem("token");
  const [groupToEdit, setGroupToEdit] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLogout = () => {
    // Modify this function
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      }
    }
  };

  const fetchUserGroups = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/usergroups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsergroups(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching usergroups data.");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const groupName = groupNameRef.current.value;

    axios
      .post(
        `${BASE_URL}/usergroups`,
        { groupName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        fetchUserGroups(); // Call the function when a new group is created
        console.log("Success:", response.data);
        closeModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/usergroups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUserGroups();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (usergroup) => {
    // Add this function
    setGroupToEdit(usergroup);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    // Add this function
    event.preventDefault();

    const groupName = groupNameRef.current.value;

    try {
      await axios.put(
        `${BASE_URL}/usergroups/${groupToEdit.id}`,
        { groupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUserGroups(); // Update the list of groups
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserGroups();
    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.fullName}!</h2>
          <p>Your email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button> {/* Add this button */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {usergroups ? (
        <div>
          <h2>Your groups</h2>

          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Admin</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {usergroups.map((usergroup) => (
                <tr key={usergroup.id}>
                  <td>{usergroup.groupName}</td>
                  <td>{usergroup.admin.fullName}</td>
                  <td>
                    {usergroup.members.map((member) => (
                      <p key={member.id}>{member.fullName}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(usergroup)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(usergroup.id)}>
                      Delete
                    </button>{" "}
                  </td>
                </tr>
                // <UserGroup usergroup={usergroup} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading usergroups...</p>
      )}
      <button onClick={openModal}>Create Group</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <label>
                Group Name:
                <input type="text" ref={groupNameRef} />{" "}
                {/* Attach the ref to the input */}
              </label>
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setIsEditModalOpen(false)}
            >
              &times;
            </span>
            <form onSubmit={handleEditSubmit}>
              <label>
                Group Name:
                <input
                  type="text"
                  defaultValue={groupToEdit.groupName}
                  ref={groupNameRef}
                />
              </label>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsDeleteModalOpen(true)}>Delete Account</button>
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
  );
};

export default Main;
