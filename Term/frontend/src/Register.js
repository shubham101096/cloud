import React, { useState } from "react";
import axios from "axios";
import AWS from "aws-sdk";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "ASIAS7PREEGHBVLEDJTL",
  secretAccessKey: "D7Pi9cwFJJKrp2+YH0X/oJrSnATfnxPOf9N1cgh7",
  sessionToken:
    "FwoGZXIvYXdzEH0aDLh1WJLdRWx9v1onoiLAAVD0f8fATpc70PktArUvEbEuofZiDMsM4CiqdQ8zG/t0xptthv93BjhaTj7MUfe5+a/GM+OSZaxQfooexQjWijiTjFal7mpDBo48rZXCo9gWHtyKKMg4K1/Uh3jAIAXTA1zKZoym2Xj/F/zBvREr2N8oWCo86XfJQXYISNK26nvT8lowuKDeVItwTYUWvQippsKIwtHdjyPLULE1FvctBnQy/mKPqjB1bo1tmnNxxsI2OV9n3cls9p5NhRyejhkTPCiFz4WlBjItfYgB24D7Fu+RGWNWxWb6CCliFSqNCuAAYcTtztw31SlVXPWtivdtpwCWmGUZ",
};

AWS.config.update(AWS_CONFIG);

const lambda = new AWS.Lambda({ region: "us-east-1" });

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
      console.log("response.Payload.registered", response.Payload.registered);

      const parsedResponse = JSON.parse(JSON.parse(response.Payload).body);
      const isRegistered = parsedResponse.registered;

      //   if (response.Payload.body.registered) {
      if (isRegistered) {
        setRegistrationStatus("Already registered");
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
