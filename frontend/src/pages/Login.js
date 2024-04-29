import { Form, Input, Button, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import backgroundImage from "./background.jpg"; // Import your background image

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Submit for Login
  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        textAlign: "center",
        backgroundImage: `url(${backgroundImage})`,
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
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Welcome Back</h2>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              style={{ width: "300px", marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              style={{ width: "300px", marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "300px" }}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: "20px" }}>
          <span style={{ marginRight: "10px" }}>Not a User?</span>
          <Link to="/register">Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
