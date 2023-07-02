const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const email = event.email;
    const password = event.password

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return {
        statusCode: 200,
        body: JSON.stringify({ registered: true }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: 'users',
      Item: {
        email,
        password: hashedPassword,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ registered: false }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error occurred during registration' }),
    };
  }
};

const getUserByEmail = async (email) => {
  const params = {
    TableName: 'users',
    Key: {
      email,
    },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item;
};
