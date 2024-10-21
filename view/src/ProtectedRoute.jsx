import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    fetch(`/api/is_username_exist/${decodedToken.username}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.isExist) {
          sessionStorage.removeItem("token");
          return <Navigate to="/login" />;
        }
      });

    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      sessionStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

    if (allowedRoles.includes(decodedToken.role)) {
      return element;
    } else {
      return <Navigate to="/404" />;
    }
  } catch (error) {
    sessionStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
