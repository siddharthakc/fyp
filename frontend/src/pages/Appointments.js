import { Table, Spin, Empty } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, userDataRes] = await Promise.all([
        axios.get("/api/user/user-appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.post(
          "/api/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
      ]);

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data);
      }

      if (userDataRes.data.success) {
        setUserData(userDataRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Doctor Info",
      dataIndex: "doctorInfo",
    },
  ];

  return (
    <Layout>
      <h3 align="center">Appointments Lists</h3>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <div>Email: {userData.email}</div>
          {appointments.length > 0 ? (
            <Table columns={columns} dataSource={appointments} />
          ) : (
            <Empty description="No appointments found" />
          )}
        </>
      )}
    </Layout>
  );
};

export default Appointments;
