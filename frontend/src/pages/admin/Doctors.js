import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Modal } from "antd";
import { Link } from "react-router-dom";
import Layout from "./../../components/Layout";

const { Search } = Input;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error(res.data.message || "Failed to fetch doctors.");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      } else {
        message.error(res.data.message || "Failed to update account status.");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong.");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value.trim().toLowerCase());
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    return fullName.includes(searchValue);
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <Button
            className="m-1"
            type="primary"
            onClick={() => handleAccountStatus(record, "approved")}
            disabled={record.status === "approved"}
          >
            Approve
          </Button>
          <Button
            className="m-1"
            type="danger"
            onClick={() => handleAccountStatus(record, "rejected")}
            disabled={record.status === "rejected"}
          >
            Reject
          </Button>
          <Button
            className="m-1"
            onClick={() => {
              setSelectedDoctor(record);
              setModalVisible(true);
            }}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-2">
        <h3 className="text-center m-3">All Doctors</h3>
        <Search
          placeholder="Search by name or status"
          onSearch={handleSearch}
          enterButton
        />
      </div>
      <Table columns={columns} dataSource={filteredDoctors} loading={loading} />
      <Modal
        title="Doctor Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedDoctor && (
          <div>
            <p>
              Name: {`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
            </p>
            <p>Email: {selectedDoctor.email}</p>
            <p>Phone: {selectedDoctor.phone}</p>
            <p>Address: {selectedDoctor.address}</p>
            <p>Specialization: {selectedDoctor.specialization}</p>
            <p>Experience: {selectedDoctor.experience}</p>
            <p>Fees Per Consultation: {selectedDoctor.feesPerConsultation}</p>
            <p>Status: {selectedDoctor.status}</p>
            <p>User ID: {selectedDoctor.userId}</p>
            <p>
              Created Date:{" "}
              {new Date(selectedDoctor.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Doctors;
