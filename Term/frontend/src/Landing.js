import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/register");
      };

      const handleLogin = () => {
        navigate("/login");
      };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
          <br></br>
          <br></br>
          <Button variant="secondary" onClick={handleLogin}>
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
