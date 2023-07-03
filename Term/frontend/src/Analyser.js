import React, { useState } from "react";
import AWS from "aws-sdk";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "ASIAS7PREEGHGANN4DUG",
  secretAccessKey: "0uR+LiKdWiqKtrRSZr3wCgJpgFIRzwAhEfecFG+H",
  sessionToken:
    "FwoGZXIvYXdzEJ7//////////wEaDJo4VAMz6jsl3AFerCLAAVJPN4nsrazN6fWCcFkiW8/jRsx+aGNl8SKCVOimgfbZVqIWjn7NqB5jeycqdx8i3Oh6Xhbutjb4pnGkMsd4TOxxxgFwtSDiz36Q+BfRW9dIWQNT0H0WjkrWktWDxTFNbkm4DQyOU7F5nwW80gVkV9Ga2NJVSwMyiGrKcGaCHVZw2ODCNVjYKVilaMLRyGpt7VYsGyBGgZFmS1hPPfO79KmTBg/aoafEg2tS2dBrvB1Utk7W08ldYZPKvCeftEVWwCiX7IylBjItYrkqoWUl8OmHeAfRwoiT9aZlOr+97tMsXYOLPA/UOQkPIWj03V87Zd8YQrqo",
};

AWS.config.update(AWS_CONFIG);

const lambda = new AWS.Lambda({ region: "us-east-1" });

const Analyser = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("email") !== null
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [extractedObjects, setExtractedObjects] = useState("");
  const [modifiedText, setModifiedText] = useState("");

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

  const callComprehendLambda = async () => {
    console.log("callComprehendLambda");
    try {
      const params = {
        FunctionName: "comprehend",
        Payload: JSON.stringify({ text: extractedText }),
      };

      const modifiedResponse = await lambda.invoke(params).promise();

      const modifiedText = JSON.parse(modifiedResponse.Payload).body;
      setModifiedText(modifiedText);
      console.log("callComprehendLambda---------");
    } catch (error) {
      console.error("Error:", error);
    }
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
        {/* <Col>
          <Button variant="primary" onClick={callComprehendLambda}>
            Remove sensitive Text
          </Button>
        </Col> */}
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
          </Col>
        </Row>
      )}
      {modifiedText && (
        <Row className="mb-3">
          <Col>
            <div>Modified Text: {modifiedText}</div>
          </Col>
        </Row>
      )}
    </Container>
    )}
    </div>
  );
};

export default Analyser;
