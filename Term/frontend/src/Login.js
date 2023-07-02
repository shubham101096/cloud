import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "ASIAS7PREEGHBVLEDJTL",
  secretAccessKey: "D7Pi9cwFJJKrp2+YH0X/oJrSnATfnxPOf9N1cgh7",
  sessionToken:
    "FwoGZXIvYXdzEH0aDLh1WJLdRWx9v1onoiLAAVD0f8fATpc70PktArUvEbEuofZiDMsM4CiqdQ8zG/t0xptthv93BjhaTj7MUfe5+a/GM+OSZaxQfooexQjWijiTjFal7mpDBo48rZXCo9gWHtyKKMg4K1/Uh3jAIAXTA1zKZoym2Xj/F/zBvREr2N8oWCo86XfJQXYISNK26nvT8lowuKDeVItwTYUWvQippsKIwtHdjyPLULE1FvctBnQy/mKPqjB1bo1tmnNxxsI2OV9n3cls9p5NhRyejhkTPCiFz4WlBjItfYgB24D7Fu+RGWNWxWb6CCliFSqNCuAAYcTtztw31SlVXPWtivdtpwCWmGUZ",
};

AWS.config.update(AWS_CONFIG);

const lambda = new AWS.Lambda({ region: "us-east-1" });

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    if (!email) {
      setErrorMessages(["Email is required"]);
      return;
    }
    if (!password) {
      setErrorMessages(["Password is required"]);
      return;
    }

    try {
      const params = {
        FunctionName: "login",
        Payload: JSON.stringify({ email, password }),
      };

      const response = await lambda.invoke(params).promise();

      const parsedResponse = JSON.parse(JSON.parse(response.Payload).body);
      const isLoginSuccess = parsedResponse.login;

      if (isLoginSuccess) {
        setLoginStatus("Login successful");
        navigate("/analyser");
      } else {
        if (parsedResponse.userExists) {
            setLoginStatus("Invalid password");
        } else {
            setLoginStatus("Email not registered");
        }
      }
      setErrorMessages([]);
    } catch (error) {
      console.error(error);
      setLoginStatus("Error occurred during login");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="mt-5 ms-3">
      <h1 className="mb-3">Login</h1>
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

        {errorMessages.length > 0 && (
          <Alert variant="danger" className="mb-3">
            {errorMessages.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}

        {loginStatus && (
          <Alert variant="info" className="mb-3">
            {loginStatus}
          </Alert>
        )}

        <Button variant="primary" type="submit" className="mb-3">
          Login
        </Button>
        <br />
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Login;
