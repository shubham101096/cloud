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
                    <h2>Welcome to Image Analyser!</h2>
                    <p className="landing-para">
                        Welcome to Image Analyser, a powerful web app designed to simplify your image analysis experience.
                        With Image Analyser, you can effortlessly extract valuable information from your images in just a few clicks.
                        Getting started is easy. Simply create an account to unlock a world of possibilities.
                        <br></br>
                        <br></br>
                        Once registered, log in to your personalized dashboard, where you can upload your desired image from your PC.
                        Now comes the exciting part. You have two options at your disposal: 'Extract text' and 'Extract Objects'.
                        Choose 'Extract text' to unleash the power of our cloud-based processing. Your image will be swiftly analyzed,
                        and the extracted text will be presented to you in a clear and organized manner.
                        Need to save it for later? No problem! You can download the extracted text as a convenient txt file.
                        <br></br>
                        <br></br>
                        Alternatively, select 'Extract Objects' to dive into the world of object identification.
                        The cloud will skillfully process your image, and you'll receive a comprehensive list of identified objects.
                        Want to keep this list handy? You got it! Download the list as a handy csv file.
                        <br></br>
                        <br></br>
                        With Image Analyser, complex image analysis becomes a breeze. Empower yourself with cutting-edge technology
                        and make the most of your images like never before.
                        Let Image Analyser elevate your image analysis game, one click at a time.
                        Start your journey today and unlock the potential of your visuals!
                    </p>
                    <Button variant="primary" onClick={handleRegister} className='me-3'>
                        Register
                    </Button>
                    <Button variant="secondary" onClick={handleLogin}>
                        Login
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
