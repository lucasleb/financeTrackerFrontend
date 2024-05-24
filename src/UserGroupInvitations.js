import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const UserGroupInvitations = ({ token, fetchUserGroups, useradmingroups }) => {
  const [receivedinvitations, setReceivedinvitations] = useState(null);
  const [pendinginvitations, setPendinginvitations] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchReceivedInvitations = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/invitations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReceivedinvitations(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching receivedinvitations data.");
      }
    }
  };

  const fetchPendingInvitations = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/invitations/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendinginvitations(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching pendinginvitations data.");
      }
    }
  };

  const handleAccept = async (invitationId) => {
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/invitations/${invitationId}/accept`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchReceivedInvitations();
        fetchUserGroups();
      } catch (err) {
        console.error(err);
        alert("Error accepting invitation.");
        fetchReceivedInvitations();
      }
    }
  };

  const handleDecline = async (invitationId) => {
    if (token) {
      try {
        await axios.delete(`${BASE_URL}/invitations/${invitationId}/decline`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchReceivedInvitations();
      } catch (err) {
        console.error(err);
        alert("Error declining invitation.");
      }
    }
  };

  const handleCreate = (event) => {
    event.preventDefault();

    axios
      .post(
        `${BASE_URL}/invitations`,
        {
          groupId: event.target[0].value,
          invitedUserEmail: event.target[1].value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Success:", response.data);
        setIsCreateModalOpen(false);
        fetchPendingInvitations();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/invitations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPendingInvitations();

      console.log("Invitation deleted");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchReceivedInvitations();
    fetchPendingInvitations();
  }, []);

  return (
    <div>
      <h2>Invitations</h2>

      {receivedinvitations ? (
        receivedinvitations.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Sender</th>
                </tr>
              </thead>
              <tbody>
                {receivedinvitations.map((invitation) => (
                  <tr key={invitation.invitationId}>
                    <td>{invitation.groupName}</td>
                    <td>{invitation.authorEmail}</td>
                    <td>
                      <button
                        onClick={() => handleAccept(invitation.invitationId)}
                      >
                        Accept
                      </button>{" "}
                      <button
                        onClick={() => handleDecline(invitation.invitationId)}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No invitations received</p>
        )
      ) : (
        <p>Loading...</p>
      )}

      {pendinginvitations ? (
        pendinginvitations.length > 0 ? (
          <div>
            <h3>Sent invitations pending</h3>
            <table>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Recipient</th>
                </tr>
              </thead>
              <tbody>
                {pendinginvitations.map((invitation) => (
                  <tr key={invitation.invitationId}>
                    <td>{invitation.groupName}</td>
                    <td>{invitation.invitedUserEmail}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(invitation.invitationId)}
                      >
                        Delete
                      </button>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No sent invitations pending</p>
        )
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={() => setIsCreateModalOpen(true)}>New invitation</button>
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              &times;
            </span>
            {useradmingroups && useradmingroups.length > 0 ? (
              <form onSubmit={handleCreate}>
                <label>
                  Group:
                  <select>
                    {useradmingroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Email user to invite:
                  <input type="text" />{" "}
                </label>
                <button type="submit">Send invitation</button>
              </form>
            ) : (
              <p>You are not the admin of any group.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGroupInvitations;
