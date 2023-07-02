import React, { useState } from 'react';
import axios from 'axios';
import AWS from "aws-sdk";

const AWS_CONFIG = {
    region: "us-east-1",
    accessKeyId: "ASIAS7PREEGHNOKUCB2H",
    secretAccessKey: "ornQCId92ReQPvHS8hnz5rrwwY6qtQBSHuYEaj/p",
    sessionToken: "FwoGZXIvYXdzEHMaDMNVbeE+zlijmk4TOCLAAX384AbiDFy5zKRcfId5VGi3RKXwNfoukViQTJWw5lE709NHfEaSQmG0rKlMg0sGlDRxI/tw1WiajJA53yNjPqvX82xAT58AvM0TN2XzJEDN1wm/5tODIxITVoIIfFbY3bt/N3LdZBAHdyxT/00SOLoq1L5AOVkL7n/y0WgKKuqhadTjw7OegPTgxmszjbW7k4JperTsFLfR6DkREXBDw0CPwILhsfJSGXQKxsK90zqluXpp3Lgpby0fANRBLgrODiiItIOlBjItTe2CaCmHd+0XKPCP+rJT2koOPl3jGmzD70dvU5Owz2qLGngsgd5Vb+e6Zsty",
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
            console.log("hii");
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
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={callTextractLambda}>Upload and Extract Text</button>
        <button onClick={callRekognitionLambda}>Recognise objects</button>
        <button onClick={callComprehendLambda}>Remove sensitive Text</button>
        {extractedText && <div>Extracted Text: {extractedText}</div>}
        {extractedObjects && <div>Extracted Objects: {extractedObjects}</div>}
        {modifiedText && <div>Modified Text: {modifiedText}</div>}
      </div>
    );
  };
  
  export default Analyser;
