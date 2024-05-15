import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Welcome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get('http://localhost:8005/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
        } catch (err) {
          console.error(err);
          alert('Error fetching user data.');
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.fullName}!</h2>
          <p>Your email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Welcome;
