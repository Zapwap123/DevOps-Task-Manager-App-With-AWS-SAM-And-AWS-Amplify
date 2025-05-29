const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TASKS_TABLE = process.env.TASKS_TABLE;

// Allowed frontend origins
const allowedOrigins = ["https://main.dtpj1l0uqgd70.amplifyapp.com"];

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const isAllowed = allowedOrigins.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  try {
    const claims = event.requestContext.authorizer.claims;
    const groups = claims["cognito:groups"] || [];
    const username = claims["cognito:username"];

    let params;

    if (groups.includes("Admin")) {
      // Admin sees all tasks
      params = {
        TableName: TASKS_TABLE,
      };
      const data = await dynamoDb.scan(params).promise();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data.Items),
      };
    } else {
      // Member sees only assigned tasks
      params = {
        TableName: TASKS_TABLE,
        IndexName: "AssignedToIndex",
        KeyConditionExpression: "assignedTo = :user",
        ExpressionAttributeValues: {
          ":user": username,
        },
      };
      const data = await dynamoDb.query(params).promise();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data.Items),
      };
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
