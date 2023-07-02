const AWS = require('aws-sdk');
const comprehend = new AWS.Comprehend();

exports.handler = async (event) => {
  try {
    console.log("------------------------------")
    console.log(event);
    const text  = event.text;

    const params = {
      LanguageCode: 'en',
      TextList: [text],
    };

    // const piiResponse = await comprehend.detectPiiEntities(params).promise();
    // const piiEntities = piiResponse.Entities;

    // let modifiedText = text;
    // piiEntities.forEach((entity) => {
    //   modifiedText = modifiedText.replace(entity.Text, 'X-XXXXX-X');
    // });

    const response1 = await comprehend.batchDetectSentiment(params).promise();

    // response.ResultList.map(result => ({
    //   Text: result.Text,
    //   Sentiment: result.Sentiment,
    //   Score: result.SentimentScore,
    // }));

    const response = {
      statusCode: 200,
      body: "modifiedText",
    };

    return response;
  } catch (error) {
    console.error('Error:', error);

    const response = {
      statusCode: 500,
      body: 'Internal Server Error',
    };

    return response;
  }
};
