const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const cognito = new AWS.CognitoIdentityServiceProvider();

const TASKS_TABLE = process.env.TASKS_TABLE;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const USER_POOL_ID = process.env.USER_POOL_ID;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://main.dtpj1l0uqgd70.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const groups =
      event.requestContext.authorizer.claims["cognito:groups"] || [];
    if (!groups.includes("Admin")) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: "Only Admins can create tasks." }),
      };
    }

    const body = JSON.parse(event.body);
    const taskId = uuidv4();

    const assignedUsername = body.assignedTo;

    // 👇 Fetch email from Cognito
    const userData = await cognito
      .adminGetUser({
        UserPoolId: USER_POOL_ID,
        Username: assignedUsername,
      })
      .promise();

    const emailAttr = userData.UserAttributes.find(
      (attr) => attr.Name === "email"
    );

    if (!emailAttr) {
      throw new Error("Assigned user has no email attribute.");
    }

    const assignedEmail = emailAttr.Value;

    const taskItem = {
      taskId,
      title: body.title,
      description: body.description,
      assignedTo: assignedUsername,
      status: "Pending",
      deadline: body.deadline,
      createdAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: TASKS_TABLE,
        Item: taskItem,
      })
      .promise();

    await ses
      .sendEmail({
        Source: SENDER_EMAIL,
        Destination: {
          ToAddresses: [assignedEmail],
        },
        Message: {
          Subject: { Data: "New Task Assigned" },
          Body: {
            Text: {
              Data: `Hello ${assignedUsername},\n\nYou have been assigned a new task:\n\nTitle: ${taskItem.title}\nDescription: ${taskItem.description}\nDeadline: ${taskItem.deadline}`,
            },
          },
        },
      })
      .promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "Task created and email sent",
        task: taskItem,
      }),
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
