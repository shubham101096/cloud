const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
  try {
    const image = event.image;

    const params = {
      Image: {
        Bytes: Buffer.from(image, 'base64'),
      },
    };

    const response = await rekognition.detectLabels(params).promise();

    const objects = response.Labels.map((label) => label.Name);
    const result = objects.join(',');

    return {
      statusCode: 200,
      body: result,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
