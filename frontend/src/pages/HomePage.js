import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Empty, Input, Typography, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import DoctorList from "../components/DoctorList";
import Layout from "./../components/Layout";

const { Search } = Input;
const { Title, Text } = Typography;

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value.trim().toLowerCase());
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName.toLowerCase().includes(searchQuery) ||
      doctor.lastName.toLowerCase().includes(searchQuery) ||
      doctor.specialization.toLowerCase().includes(searchQuery)
  );

  return (
    <Layout>
      <Row justify="center" style={{ marginBottom: "24px" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={2}>Find a Doctor</Title>
          <Text type="secondary">
            Book appointments with trusted healthcare professionals
          </Text>
          <Space direction="vertical" style={{ marginTop: 16 }}>
            <Search
              placeholder="Search by name or specialization"
              allowClear
              onSearch={handleSearch}
              prefix={<SearchOutlined />}
              style={{ maxWidth: "300px" }}
            />
          </Space>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24}>
          {loading ? (
            <Spin size="large" />
          ) : filteredDoctors.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredDoctors.map((doctor) => (
                <Col key={doctor._id} xs={24} sm={12} md={8} lg={6}>
                  <DoctorList doctor={doctor} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No doctors available" />
          )}
        </Col>
      </Row>
    </Layout>
  );
};

export default HomePage;
