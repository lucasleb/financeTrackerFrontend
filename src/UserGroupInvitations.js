import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

const UserGroupInvitations = ({ user, token, fetchUserGroups }) => {
  const [usergroupinvitations, setUsergroupinvitations] = useState(null);

  const fetchUserGroupInvitations = async () => {
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/invitations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response.data);

        setUsergroupinvitations(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching usergroupinvitations data.");
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

        fetchUserGroupInvitations();
      } catch (err) {
        console.error(err);
        alert("Error accepting invitation.");
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

        fetchUserGroupInvitations();
      } catch (err) {
        console.error(err);
        alert("Error declining invitation.");
      }
    }
  };

  useEffect(() => {
    fetchUserGroupInvitations();
  }, []);

  return (
    <div>
      {usergroupinvitations ? (
        <div>
          <h2>Invitations</h2>
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Sender</th>
              </tr>
            </thead>
            <tbody>
              {usergroupinvitations.map((usergroupinvitation) => (
                <tr key={usergroupinvitation.invitationId}>
                  <td>{usergroupinvitation.groupName}</td>
                  <td>{usergroupinvitation.authorEmail}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleAccept(usergroupinvitation.invitationId)
                      }
                    >
                      Accept
                    </button>{" "}
                    <button
                      onClick={() =>
                        handleDecline(usergroupinvitation.invitationId)
                      }
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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserGroupInvitations;
