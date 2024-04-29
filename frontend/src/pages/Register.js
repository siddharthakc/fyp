import { Form, Input, Button, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import backgroundImage from "./background.jpg"; // Import your background image

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Submit for Register
  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        message.success("Registration Successful");
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Registration Failed");
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
        <h1 style={{ marginBottom: "30px" }}>Register</h1>
        <Form layout="vertical" onFinish={submitHandler}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: "Your name must be at least 3 characters" },
              { max: 50, message: "Your name cannot exceed 50 characters" },
            ]}
          >
            <Input
              placeholder="Name"
              style={{ width: "300px", marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email!" },
            ]}
          >
            <Input
              placeholder="Email"
              style={{ width: "300px", marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Your password must be at least 8 characters",
              },
              {
                max: 128,
                message: "Your password cannot exceed 128 characters",
              },
              {
                pattern:
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              style={{ width: "300px", marginBottom: "20px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "300px" }}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: "20px" }}>
          <span style={{ marginRight: "10px" }}>Already a User?</span>
          <Link to="/login">Login Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
