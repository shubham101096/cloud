const axios = require('axios');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  console.log('event=', event)
  const value = event.value;
  console.log("value=", value);
  const course_uri = event.course_uri;

  const saltRounds = 12;
  const bcrypt_hash = await bcrypt.hash(value, saltRounds);
  console.log("bcrypt=", bcrypt_hash);

  const output = {
    banner: "B00917146",
    result: bcrypt_hash,
    arn: "arn:aws:lambda:us-east-1:205053501838:function:bcryptLambda",
    action: "bcrypt",
    value: value
  };

  try {
    const response = await axios.post(course_uri, output);

    console.log("POST request sent successfully");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Failed to send POST request:", error.message);
  }

  return output;
};
