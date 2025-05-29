const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TASKS_TABLE = process.env.TASKS_TABLE;
const NOTIFICATION_TOPIC_ARN = process.env.NOTIFICATION_TOPIC_ARN;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://main.dtpj1l0uqgd70.amplifyapp.com",
];

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

    const taskId = event.pathParameters.taskId;
    const body = JSON.parse(event.body);

    const taskData = await dynamoDb
      .get({
        TableName: TASKS_TABLE,
        Key: { taskId },
      })
      .promise();

    if (!taskData.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    if (!groups.includes("Admin") && taskData.Item.assignedTo !== username) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Forbidden to update this task" }),
      };
    }

    await dynamoDb
      .update({
        TableName: TASKS_TABLE,
        Key: { taskId },
        UpdateExpression: "set #s = :status",
        ExpressionAttributeNames: {
          "#s": "status",
        },
        ExpressionAttributeValues: {
          ":status": body.status,
        },
      })
      .promise();

    await sns
      .publish({
        TopicArn: NOTIFICATION_TOPIC_ARN,
        Message: `Task "${taskData.Item.title}" status updated to ${body.status} by ${username}`,
        Subject: "Task Status Updated",
      })
      .promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Task status updated" }),
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
