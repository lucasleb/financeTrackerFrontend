import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Welcome from './Welcome';
import PrivateRoute from './PrivateRoute';
import Logout from './Logout';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="" element={<Welcome />} />
        </Route>
        <Route path="/logout" element={<Logout />} /> 


      </Routes>
    </Router>
  );
}

export default App;

// test
