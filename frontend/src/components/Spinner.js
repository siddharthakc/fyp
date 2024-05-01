import React from "react";
import Spinner from "react-bootstrap/Spinner";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center spinner">
      <Spinner animation="border" variant="info" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
