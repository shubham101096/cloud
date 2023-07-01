import React, { useState } from 'react';
import axios from 'axios';
import AWS from "aws-sdk";

const AWS_CONFIG = {
    region: "us-east-1",
    accessKeyId: "ASIAS7PREEGHFOKJ6ZGA",
    secretAccessKey: "PCyvMhSKTtrk8WZCMqtFxLGXZbG97fhPaMHBAO4L",
    sessionToken: "FwoGZXIvYXdzEGwaDIm99XKoTV7zh0ajAyLAARhjokgllUNdZuIvAcXurFSKy9jymguzEaaKcIPA7Z0UVPdbOgwqK1AozhE/PuGC92vdBHNt7Q7I+O4lohDTdlTD4lGWHfur09BWucnypCfSeIwQY/Ql3OBjBsGg5d3M3LKc0iFTxLbxeVkwXYclAQq8I3lfU2jCjgZgGMRrpaUvazDxYiapUEhZy96OowwtvZOcHq6O5NEncOloXpSdeAqzlGWXt4l537qtgjW5FXEpwcgYv7CU9MyKAcG9rrt04ijF3YGlBjItyDWR8bEOjrVwg/gk5V19l1xVXoJ5CKobfVojiunM6kvRXe/0cVGe1XVhkWKP",
  };
  
  AWS.config.update(AWS_CONFIG);
  
  const lambda = new AWS.Lambda({ region: "us-east-1" });

  
  const Textract = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
  
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
  
    return (
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={callTextractLambda}>Upload and Extract Text</button>
        {extractedText && <div>Extracted Text: {extractedText}</div>}
      </div>
    );
  };
  
  export default Textract;
  



// const Textract = () => {
//     const [image, setImage] = useState(null);
//   const [text, setText] = useState('');
//   const [error, setError] = useState(null);
//   const [imageBase64, setImageBase64] = useState('');

//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//         const base64 = await convertImageToBase64(file);
//         setImageBase64(base64);
//       }
//   };

//   const convertImageToBase64 = (imageFile) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         resolve(reader.result.split(',')[1]);
//       };

//       reader.onerror = () => {
//         console.log("failed");
//         reject(new Error('Failed to convert image to base64'));
//       };

//       reader.readAsDataURL(imageFile);
//     });
//   };

//   const handleUpload = async () => {
//     const params = {
//       FunctionName: 'textract',
//       Payload: JSON.stringify({ image: imageBase64 }),
//     };

//     try {
//       const data = await lambda.invoke(params).promise();
//       const response = JSON.parse(data.Payload);
  
//       setText(response.text);
//       setError(null);
//     } catch (error) {
//         console.error('Error:', error);
//         setError('Error calling the Lambda function');
//     }
//   };


// //   const handleUpload = async () => {
// //     if (!image) {
// //         setError('No image selected');
// //         return;
// //     }
// //     try {  
// //         const reader = new FileReader();
// //         reader.onloadend = async () => {
// //           const imageBuffer = Buffer.from(reader.result);
  
// //           const params = {
// //             FunctionName: 'textract',
// //             Payload: JSON.stringify({ image: imageBuffer.toString('base64') }),
// //           };
  
// //           const data = await lambda.invoke(params).promise();
// //           const response = JSON.parse(data.Payload);
  
// //           setText(response.text);
// //           setError(null);
// //         };
  
// //         reader.onerror = () => {
// //           setError('Error reading the image file');
// //         };
  
// //         reader.readAsArrayBuffer(image);
// //       } catch (error) {
// //         console.error('Error:', error);
// //         setError('Error calling the Lambda function');
// //       }
  
// //   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       <button onClick={handleUpload}>Upload and extract data</button>
//       {text && <div>Extracted Text: {text}</div>}
//       {error && <div>Error: {error}</div>}
//     </div>
//   );
// };

// export default Textract;
