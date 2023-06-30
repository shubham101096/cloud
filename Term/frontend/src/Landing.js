import React, { useState } from "react";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';


const AWS_CONFIG = {
  region: "us-east-1",
  accessKeyId: "ASIAS7PREEGHEBOE35XP",
  secretAccessKey: "yHQPaXZA3+UYc6+7Mp39ksqQ17ZrdgCBjxCrJe+B",
  sessionToken: "FwoGZXIvYXdzEE8aDLC1nesk+wG9mHrb/CLAATpDvsNNTlA/vcC70h1qhAQzgvQE5z2TPjhQTjxDZ9cg5QfzSuMdGGrJTfrYnENY+qhE03UJaGYiR+yE8tNaikWMs1qgWAdDFBie89aJLNPz/a8gvjW6z+523NJ9ZtTWBIPFNiJEr3fRroGO9Ws5utQyYMzEJ7OQPAJItuPIh8Nv8pF6H43wgBv5QtF1l0bcqusQ5Z+7Fxysvsr7F0fBBVbN4Ee1juR0LRHsva4xt+Z/EXeT8tyeYfb2Sm/WQ1KXgSjMsvukBjItZXCVA+O//uAzdnwZMW7JJMnpEO4nuADN7lOv+7sQi6JA1A4UtD+CZQHBC7TS",
};

AWS.config.update(AWS_CONFIG);

const lambda = new AWS.Lambda({ region: "us-east-1" });

const Landing = () => {
  const [response, setResponse] = useState(null);

  const callLambdaFunction = async () => {
    const params = {
      FunctionName: "lambda1",
      Payload: JSON.stringify({ message: "hi" }),
    };
    const response = await lambda.invoke(params).promise();
    const result = JSON.parse(response.Payload);
    setResponse(result)
    console.log(result);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={callLambdaFunction}>
        Call Lambda Function
      </Button>
      {response && (
        <div>
          <h3>Response from Lambda:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Landing;
