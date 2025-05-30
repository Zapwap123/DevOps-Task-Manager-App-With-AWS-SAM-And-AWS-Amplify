const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES();

const TASKS_TABLE = process.env.TASKS_TABLE;
const USER_POOL_ID = process.env.USER_POOL_ID;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

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

    const assignedUsername = taskData.Item.assignedTo;

    let email;
    try {
      const userData = await cognito
        .adminGetUser({
          UserPoolId: USER_POOL_ID,
          Username: assignedUsername,
        })
        .promise();

      const emailAttr = userData.UserAttributes.find(
        (attr) => attr.Name === "email"
      );
      email = emailAttr?.Value;
    } catch (err) {
      console.error(
        `Could not fetch Cognito user email for ${assignedUsername}`,
        err
      );
    }

    if (email) {
      const emailParams = {
        Source: SENDER_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: {
            Data: `Task Status Updated: ${taskData.Item.title}`,
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: `Hi ${assignedUsername},\n\nYour task "${taskData.Item.title}" was updated to status "${body.status}" by ${username}.\n\nRegards,\nTask Manager`,
              Charset: "UTF-8",
            },
          },
        },
      };

      await ses.sendEmail(emailParams).promise();
      console.log(`Email sent to ${email}`);
    } else {
      console.log(`No email found for user ${assignedUsername}`);
    }

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
