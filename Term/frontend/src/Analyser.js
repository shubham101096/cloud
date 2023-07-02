import React, { useState } from 'react';
import AWS from "aws-sdk";
import { Container, Row, Col, Button } from 'react-bootstrap';


const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "ASIAS7PREEGHBVLEDJTL",
  secretAccessKey: "D7Pi9cwFJJKrp2+YH0X/oJrSnATfnxPOf9N1cgh7",
  sessionToken:
    "FwoGZXIvYXdzEH0aDLh1WJLdRWx9v1onoiLAAVD0f8fATpc70PktArUvEbEuofZiDMsM4CiqdQ8zG/t0xptthv93BjhaTj7MUfe5+a/GM+OSZaxQfooexQjWijiTjFal7mpDBo48rZXCo9gWHtyKKMg4K1/Uh3jAIAXTA1zKZoym2Xj/F/zBvREr2N8oWCo86XfJQXYISNK26nvT8lowuKDeVItwTYUWvQippsKIwtHdjyPLULE1FvctBnQy/mKPqjB1bo1tmnNxxsI2OV9n3cls9p5NhRyejhkTPCiFz4WlBjItfYgB24D7Fu+RGWNWxWb6CCliFSqNCuAAYcTtztw31SlVXPWtivdtpwCWmGUZ",
};
  
  AWS.config.update(AWS_CONFIG);
  
  const lambda = new AWS.Lambda({ region: "us-east-1" });

  
  const Analyser = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [extractedObjects, setExtractedObjects] = useState('');
    const [modifiedText, setModifiedText] = useState('');
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      setSelectedImage(file);
      setExtractedText("");
      setExtractedObjects("");
    };
  
    const callTextractLambda = async () => {
      if (!selectedImage) {
        console.error('No image selected');
        return;
      }

      const reader = new FileReader();
  
      reader.onload = async (event) => {
        try {
          const imageBase64 = event.target.result.split(',')[1];
  
          const params = {
            FunctionName: 'textract',
            Payload: JSON.stringify({ image: imageBase64 }),
          };
  
          const data = await lambda.invoke(params).promise();
  
          if (data.StatusCode === 200) {
            const responsePayload = JSON.parse(data.Payload);
            setExtractedText(responsePayload.body);
          } else {
            const responsePayload = JSON.parse(data.Payload);
            console.error('Error:', responsePayload.body);
            setExtractedText(responsePayload.body);
          }
        } catch (error) {
            console.error('Error:', error);
        }
      };
  
      reader.readAsDataURL(selectedImage);
    };

    const callRekognitionLambda = async () => {
        if (!selectedImage) {
          console.error('No image selected');
          return;
        }
  
        const reader = new FileReader();
    
        reader.onload = async (event) => {
          try {
            const imageBase64 = event.target.result.split(',')[1];
    
            const params = {
              FunctionName: 'rekognition',
              Payload: JSON.stringify({ image: imageBase64 }),
            };
    
            const data = await lambda.invoke(params).promise();
    
            if (data.StatusCode === 200) {
              const responsePayload = JSON.parse(data.Payload);
              setExtractedObjects(responsePayload.body);
              console.log("hii rekogniton");
            } else {
              const responsePayload = JSON.parse(data.Payload);
              console.error('Error:', responsePayload.body);
              setExtractedObjects(responsePayload.body);
            }
          } catch (error) {
              console.error('Error:', error);
          }
        };
    
        reader.readAsDataURL(selectedImage);
      };

    const callComprehendLambda = async() => {
        console.log("callComprehendLambda");
        try {

            const params = {
                FunctionName: 'comprehend',
                Payload: JSON.stringify({ text: extractedText }),
              };

            const modifiedResponse = await lambda.invoke(params).promise();
      
            const modifiedText = JSON.parse(modifiedResponse.Payload).body;
            setModifiedText(modifiedText);
            console.log("callComprehendLambda---------")
          } catch (error) {
            console.error('Error:', error);
          }
    };
  
    return (
      <Container className="mt-3">
      <Row className="mb-3">
        <Col>
          <input type="file" onChange={handleImageChange} />
        </Col>
      </Row>
      {selectedImage && (
        <Row className="mb-3">
          <Col>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ maxHeight: '500px', width: 'auto' }}
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
            <div>{extractedText.split('\n').map((line, index) => <div key={index}>{line}</div>)}</div>
          </Col>
        </Row>
      )}
      {extractedObjects && (
        <Row className="mb-3">
          <Col>
            <h5>Extracted Objects</h5>
            <div>{extractedObjects.split(',').map((line, index) => <div key={index}>{line}</div>)}</div>
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
    );
  };
  
  export default Analyser;
