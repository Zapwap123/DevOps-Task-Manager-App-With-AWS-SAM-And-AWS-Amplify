const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TASKS_TABLE = process.env.TASKS_TABLE;
const NOTIFICATION_TOPIC_ARN = process.env.NOTIFICATION_TOPIC_ARN;

exports.handler = async (event) => {
  try {
    const groups =
      event.requestContext.authorizer.claims["cognito:groups"] || [];
    if (!groups.includes("Admin")) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Only Admins can create tasks." }),
      };
    }

    const body = JSON.parse(event.body);
    const taskId = uuidv4();

    const taskItem = {
      taskId,
      title: body.title,
      description: body.description,
      assignedTo: body.assignedTo,
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

    await sns
      .publish({
        TopicArn: NOTIFICATION_TOPIC_ARN,
        Message: `New task assigned: "${taskItem.title}" to ${taskItem.assignedTo}`,
        Subject: "New Task Assigned",
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Task created", task: taskItem }),
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
