const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  console.log('event=', event)
  const value = event.value;
  console.log("value=", value);

  const saltRounds = 10;
  const bcrypt_hash = await bcrypt.hash(value, saltRounds);
  console.log("bcrypt=", bcrypt_hash);

  const output = {
    banner: "B00917146",
    result: bcrypt_hash,
    arn: "arn:aws:lambda:us-east-1:205053501838:function:bcryptLambda",
    action: "bcrypt",
    value: value
  };

  return output;
};
