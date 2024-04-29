import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import backgroundImage from "./background.jpg"; // Import your background image

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Submit for Login
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        message.success("Login Successful");
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response) {
        // Server error with specific status codes
        if (error.response.status === 401) {
          message.error("Invalid credentials. Please try again.");
        } else if (error.response.status === 500) {
          message.error("Server error. Please try again later.");
        } else {
          message.error("Something went wrong");
        }
      } else if (error.request) {
        // Network error
        message.error("Network error. Please check your internet connection.");
      } else {
        // Other errors
        message.error("Something went wrong");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="login-page"
      style={{
        background: `url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "40px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            textAlign: "center",
            color: "#1890ff",
          }}
        >
          Welcome Back
        </h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Email"
              style={{ marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Password"
              style={{ marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
              }}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span style={{ color: "#666" }}>Not a User?</span>
          <Link to="/register" style={{ marginLeft: "5px", color: "#1890ff" }}>
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
