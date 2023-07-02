import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
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
          <Button variant="primary" size="lg" className="mr-3" onClick={handleRegister}>
            Register
          </Button>
          <br></br>
          <br></br>
          <Button variant="secondary" size="lg" onClick={handleLogin}>
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
