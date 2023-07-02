const AWS = require('aws-sdk');
const textract = new AWS.Textract();

exports.handler = async (event) => {
  try {
    if ('image' in event) {
      const imageBytes = Buffer.from(event.image, 'base64');
      const image = { Bytes: imageBytes };
      
      const params = {
        Document: image,
      };
      
      const response = await textract.detectDocumentText(params).promise();
      const blocks = response.Blocks;
      let extractedText = '';

      let combinedText = blocks
      .filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join('\n');
      
      const lambdaResponse = {
        statusCode: 200,
        body: combinedText.trim(),
      };
      
      
      return lambdaResponse;
    } else {
      throw new Error('Invalid image.');
    }
  } catch (err) {
    let error_message = "Failed to extract image. ";
    if (err.response && err.response.Error && err.response.Error.Message) {
      error_message += err.response.Error.Message;
    } else {
      error_message += err.message;
    }
    
    const lambdaResponse = {
      statusCode: 400,
      body: error_message,
    };
    
    return lambdaResponse;
  }
};
