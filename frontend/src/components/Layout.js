import React from "react";
import { Badge, Button, message } from "antd";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  // Sidebar menu based on user role
  const sidebarMenu = user?.isAdmin
    ? adminMenu.filter((menu) => menu.name !== "Profile")
    : user?.isDoctor
    ? [
        { name: "Home", path: "/" },
        { name: "Appointments", path: "/doctor-appointments" },
        { name: "Profile", path: `/doctor/profile/${user?._id}` },
      ]
    : userMenu.filter((menu) => menu.name !== "Profile");

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h6>Apollo</h6>
            <hr />
          </div>
          <div className="menu">
            {sidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.name}
                  className={`menu-item ${isActive && "active"}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content">
              <Badge
                count={user?.notification ? user.notification.length : 0}
                overflowCount={99}
              >
                <Button
                  type="text"
                  icon={<i className="fa-solid fa-bell"></i>}
                  onClick={() => navigate("/notification")}
                />
              </Badge>
            </div>
            <div className="user-name">
              <h5>{user?.name}</h5>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
