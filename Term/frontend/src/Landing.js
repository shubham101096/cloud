import React, { useState } from "react";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
const cors = require('cors')


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
    try {
        const response = await fetch('https://c53mql1r37.execute-api.us-east-1.amazonaws.com/prod/lambda1');
        const data = await response.json();
        console.log(data)
        setResponse(data.message);
      } catch (error) {
        console.error(error);
      }
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
