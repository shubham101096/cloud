const AWS = require('aws-sdk');
const cors = require('cors');


const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const tableName = "sentiment_data";

exports.handler = async (event) => {
  try {
    const { id, data } = JSON.parse(event.body);

    const item = {
      id: Number(id),
      data: data,
    };

    const params = {
      TableName: tableName,
      Item: item,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: 'Item inserted successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: 'Error inserting item' }),
    };
  }
};

