import React, { useState } from 'react';
import axios from 'axios';

const Textract = () => {
const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {

    // try {
    //     const response = await fetch('https://knlv6jravb.execute-api.us-east-1.amazonaws.com/prod/textract', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ image }),
    //     });
  
    //     if (!response.ok) {
    //       throw new Error('Error extracting text');
    //     }
  
    //     const data = await response.json();
    //     setText(data.text);
    //     setError(null);
    //   } catch (error) {
    //     console.error(error);
    //     setError('Error extracting text');
    //   }

    
    try {
        // const response = await fetch('https://j36czo4zn3.execute-api.us-east-1.amazonaws.com/prod/textract', {
        //     method: 'POST',
        //     body: JSON.stringify("helloooooooo"),
        //   });
        // const data = await response.json();
        // console.log(data)
    //   const response = await axios.post('https://9mgavcl18k.execute-api.us-east-1.amazonaws.com/prod/textract', { image });
    //   setText(response.data.text);
    // setError(data);

    

    const response = await axios.post('https://9mgavcl18k.execute-api.us-east-1.amazonaws.com/prod/textract');
    // const data = await response.json();
      console.log('Lambda function response:', response.data);
    setText(response.data)


    // const response = await axios.post('https://ivif8qh2ui.execute-api.us-east-1.amazonaws.com/test');
    // // const data = await response.json();
    //   console.log('Lambda function response:', response.data.message);
    // setText(response.data.message)


    } catch (error) {
        console.error(error);
        setError('Error extracting text.......');
      }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload and extract data</button>
      {text && <div>Extracted Text: {text}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Textract;
