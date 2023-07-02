const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const email = event.email;
    const password = event.password;

    const user = await getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 200,
        body: JSON.stringify({ login: false, userExists: false }),
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        statusCode: 200,
        body: JSON.stringify({ login: false, userExists: true }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ login: true, userExists: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error occurred during login' }),
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
