import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoading());
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.post(
          "/api/user/getUserData",
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(hideLoading());

        const { data } = response;
        if (data.success) {
          dispatch(setUser(data.data));
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.clear();
        dispatch(hideLoading());
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user, dispatch]);

  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
