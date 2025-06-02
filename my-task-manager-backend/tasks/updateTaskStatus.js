const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES();

const TASKS_TABLE = process.env.TASKS_TABLE;
const USER_POOL_ID = process.env.USER_POOL_ID;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

const allowedOrigins = ["https://main.dtpj1l0uqgd70.amplifyapp.com"];

// Lambda function to update task status and notify the assigned user
exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const isAllowed = allowedOrigins.includes(origin);

  // CORS headers to allow requests from the frontend
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

  // Check if the user is authenticated and has the necessary claims
  try {
    const claims = event.requestContext.authorizer.claims;
    const groups = claims["cognito:groups"] || [];
    const username = claims["cognito:username"];

    const taskId = event.pathParameters.taskId;
    const body = JSON.parse(event.body);

    // Return the task by its ID so we can update its status
    const taskData = await dynamoDb
      .get({
        TableName: TASKS_TABLE,
        Key: { taskId },
      })
      .promise();

    // Check if the task exists
    if (!taskData.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    // Check if the user is allowed to update the task
    if (!groups.includes("Admin") && taskData.Item.assignedTo !== username) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Forbidden to update this task" }),
      };
    }

    // Update the task status
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

    // Notify the assigned user via email
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

    // If email is found, send a notification email
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

    // Return a success response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Task status updated" }),
    };

    // Handle any errors that occur during the process
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
