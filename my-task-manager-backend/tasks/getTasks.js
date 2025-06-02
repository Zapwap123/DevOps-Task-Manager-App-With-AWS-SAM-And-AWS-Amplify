const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TASKS_TABLE = process.env.TASKS_TABLE;

// Allowed frontend origins
const allowedOrigins = ["https://main.dtpj1l0uqgd70.amplifyapp.com"];

// Lambda function to get tasks based on user role
exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const isAllowed = allowedOrigins.includes(origin);

  // CORS headers to allow requests from the frontend
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

  // Check if the user is authenticated and has the necessary claims
  try {
    const claims = event.requestContext.authorizer.claims;
    const groups = claims["cognito:groups"] || [];
    const username = claims["cognito:username"];

    let params;

    // Check if the user is an Admin
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
    // Handle any errors that occur during the DynamoDB operations
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
