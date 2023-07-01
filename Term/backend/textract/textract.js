const AWS = require('aws-sdk');
const textract = new AWS.Textract();

exports.handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true, 
        },
        body: JSON.stringify( "hello" ),
      };
  try {
    const { image } = JSON.parse(event.body);

    const imageBuffer = Buffer.from(image, 'base64');

    const params = {
      Document: {
        Bytes: imageBuffer,
      },
    };

    const textractResult = await textract.detectDocumentText(params).promise();

    const extractedText = textractResult.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join(' ');

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, 
      },
      body: JSON.stringify({ text: extractedText }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Credentials": true, 
      },
      body: JSON.stringify({ message: 'Error extracting text' }),
    };
  }
};
