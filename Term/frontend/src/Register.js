import React, { useState } from "react";
import axios from "axios";
import AWS from "aws-sdk";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AWS_CONFIG = {
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
};

AWS.config.update(AWS_CONFIG);
const region = process.env.REACT_APP_AWS_REGION

const lambda = new AWS.Lambda({ region });

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    if (password !== confirmPassword) {
      setErrorMessages(["Passwords do not match"]);
      return;
    }

    const errors = [];
    if (!email) {
      errors.push("Email is required");
    }
    if (!password) {
      errors.push("Password is required");
    }
    if (!confirmPassword) {
      errors.push("Confirm Password is required");
    }
    if (password.length < 6) {
        errors.push("Password should be at least 6 characters long");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const params = {
        FunctionName: "register",
        Payload: JSON.stringify({ email, password }),
      };

      const response = await lambda.invoke(params).promise();

      const parsedResponse = JSON.parse(JSON.parse(response.Payload).body);
      const isRegistered = parsedResponse.registered;

      if (isRegistered) {
        setRegistrationStatus("Email already registered");
      } else {
        setRegistrationStatus("Registration successful");
      }
      setErrorMessages([]);
    } catch (error) {
      console.error(error);
      setRegistrationStatus("Error occurred during registration");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
<div className="mt-5 ms-3">
  <h1 className="mb-3">Registration Page</h1>
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="email" className="mb-3">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={handleEmailChange}
        required
      />
    </Form.Group>

    <Form.Group controlId="password" className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
    </Form.Group>

    <Form.Group controlId="confirmPassword" className="mb-3">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
      />
    </Form.Group>

    {errorMessages.length > 0 && (
      <Alert variant="danger" className="mb-3">
        {errorMessages.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </Alert>
    )}

    {registrationStatus && (
      <Alert variant="info" className="mb-3">
        {registrationStatus}
      </Alert>
    )}
    <Button variant="primary" type="submit" className="mb-3">
      Register
    </Button>
    <br></br>
    <Button variant="primary" onClick={handleLogin}>
      Login
    </Button>
  </Form>
</div>

  );
};

export default Register;
