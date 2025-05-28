const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TASKS_TABLE = process.env.TASKS_TABLE;
const NOTIFICATION_TOPIC_ARN = process.env.NOTIFICATION_TOPIC_ARN;

exports.handler = async () => {
  try {
    // Scan all tasks with deadlines due soon (e.g., today or passed)
    const now = new Date();
    const nowISOString = now.toISOString();

    const data = await dynamoDb
      .scan({
        TableName: TASKS_TABLE,
        FilterExpression: "deadline <= :now and #st <> :done",
        ExpressionAttributeValues: {
          ":now": nowISOString,
          ":done": "Done",
        },
        ExpressionAttributeNames: {
          "#st": "status",
        },
      })
      .promise();

    if (!data.Items || data.Items.length === 0) {
      console.log("No pending tasks with deadline reached");
      return;
    }

    for (const task of data.Items) {
      await sns
        .publish({
          TopicArn: NOTIFICATION_TOPIC_ARN,
          Subject: "Task Deadline Alert",
          Message: `Task "${task.title}" assigned to ${task.assignedTo} is due or overdue! Status: ${task.status}`,
        })
        .promise();
    }
  } catch (error) {
    console.error("Error in deadline notification:", error);
  }
};
