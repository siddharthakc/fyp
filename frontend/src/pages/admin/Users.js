import { Table, Modal, Button, message, Input, Tooltip, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import moment from "moment";

const { Search } = Input;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [blockUserId, setBlockUserId] = useState(null);
  const [isBlockingModalVisible, setIsBlockingModalVisible] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleBlockUser = (userId) => {
    setBlockUserId(userId);
    setIsBlockingModalVisible(true);
  };

  const handleConfirmBlockUser = async () => {
    try {
      // Perform blocking action here
      setIsBlockingModalVisible(false);
      message.success("User blocked successfully.");
      // Refetch users after blocking
      getUsers();
    } catch (error) {
      console.log(error);
      message.error("Failed to block user.");
    }
  };

  const handleCancelBlockUser = () => {
    setBlockUserId(null);
    setIsBlockingModalVisible(false);
  };

  const handleSearch = (value) => {
    setSearchValue(value.trim().toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Date Joined",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>{moment(record.createdAt).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <Space>
          <Tooltip title="Block User">
            <Button
              className="m-1"
              type="danger"
              onClick={() => handleBlockUser(record.userId)}
            >
              Block
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-2">
        <h3 className="text-center m-2">Users List</h3>
        <Space>
          <Search
            placeholder="Search by name or email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            enterButton
          />
          <Button onClick={handleClearSearch}>Clear</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="userId"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
      />

      <Modal
        title="Confirm Block User"
        visible={isBlockingModalVisible}
        onOk={handleConfirmBlockUser}
        onCancel={handleCancelBlockUser}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to block this user?</p>
      </Modal>
    </Layout>
  );
};

export default Users;
