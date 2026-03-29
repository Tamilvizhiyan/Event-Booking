import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  
  if (isAdmin) {
    return <Navigate to="/admin" />;
  }
  
  return <Navigate to="/bookings" />;
};

export default Dashboard;
