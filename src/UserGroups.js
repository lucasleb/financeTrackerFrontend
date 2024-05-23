import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const UserGroups = ({ user, token }) => {
  const [usergroups, setUsergroups] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const groupNameRef = useRef();

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

  const handleCreate = (event) => {
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
        fetchUserGroups();
        console.log("Success:", response.data);
        setIsCreateModalOpen(false);
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

  const handleEdit = async (event) => {
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
  }, []);

  return (
    <div>
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
                    <button
                      onClick={() => {
                        setGroupToEdit(usergroup);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>{" "}
                    <button onClick={() => handleDelete(usergroup.id)}>
                      Delete
                    </button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading usergroups...</p>
      )}
      <button onClick={() => setIsCreateModalOpen(true)}>Create Group</button>

      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              &times;
            </span>
            <form onSubmit={handleCreate}>
              <label>
                Group Name:
                <input type="text" ref={groupNameRef} />{" "}
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
            <form onSubmit={handleEdit}>
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
    </div>
  );
};

export default UserGroups;
