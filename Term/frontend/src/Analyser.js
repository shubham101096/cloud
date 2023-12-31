import React, { useState } from "react";
import AWS from "aws-sdk";
import { Container, Row, Col, Button } from "react-bootstrap";
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

const Analyser = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("email") !== null
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [extractedObjects, setExtractedObjects] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setExtractedText("");
    setExtractedObjects("");
  };

  const callTextractLambda = async () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imageBase64 = event.target.result.split(",")[1];

        const params = {
          FunctionName: "textract",
          Payload: JSON.stringify({ image: imageBase64 }),
        };

        const data = await lambda.invoke(params).promise();

        if (data.StatusCode === 200) {
          const responsePayload = JSON.parse(data.Payload);
          setExtractedText(responsePayload.body);
        } else {
          const responsePayload = JSON.parse(data.Payload);
          console.error("Error:", responsePayload.body);
          setExtractedText(responsePayload.body);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    reader.readAsDataURL(selectedImage);
  };

  const callRekognitionLambda = async () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const imageBase64 = event.target.result.split(",")[1];

        const params = {
          FunctionName: "rekognition",
          Payload: JSON.stringify({ image: imageBase64 }),
        };

        const data = await lambda.invoke(params).promise();

        if (data.StatusCode === 200) {
          const responsePayload = JSON.parse(data.Payload);
          setExtractedObjects(responsePayload.body);
          console.log("hii rekogniton");
        } else {
          const responsePayload = JSON.parse(data.Payload);
          console.error("Error:", responsePayload.body);
          setExtractedObjects(responsePayload.body);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    reader.readAsDataURL(selectedImage);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem("email");
  };

  const handleLogin = async () => {
    navigate('/login');
  };

  const handleRegister = async () => {
    navigate('/register');
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "extractedText.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadCSV = () => {
    const element = document.createElement("a");
    const csvContent = extractedObjects.split(",").join("\n");
    const file = new Blob([csvContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "extractedObjects.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
    {isLoggedIn === false ?(
      <Container className="mt-3">
        <h5>Please login.</h5>
      </Container>
    ) : (
    <Container className="mt-3">
      <Row className="pull-right">
        <Col>
          <Button variant="primary" className="mb-3" onClick={handleLogout}>Logout</Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Col>
      </Row>
      {selectedImage && (
        <Row className="mb-3">
          <Col>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ maxHeight: "500px", width: "auto" }}
            />
          </Col>
        </Row>
      )}
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={callTextractLambda}>
            Extract Text
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={callRekognitionLambda}>
            Extract objects
          </Button>
        </Col>
      </Row>
      {extractedText && (
        <Row className="mb-3">
          <Col>
            <h5>Extracted Text</h5>
            <div>
              {extractedText.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <Button variant="primary" onClick={handleDownloadText}>
              Download Extracted Text (TXT)
            </Button>
          </Col>
        </Row>
      )}
      {extractedObjects && (
        <Row className="mb-3">
          <Col>
            <h5>Extracted Objects</h5>
            <div>
              {extractedObjects.split(",").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <Button variant="primary" onClick={handleDownloadCSV}>
              Download Extracted Objects (CSV)
            </Button>
          </Col>
        </Row>
      )}
    </Container>
    )}
    </div>
  );
};

export default Analyser;
