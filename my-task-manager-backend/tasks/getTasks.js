const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TASKS_TABLE = process.env.TASKS_TABLE;

exports.handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.claims;
    const groups = claims["cognito:groups"] || [];
    const username = claims["cognito:username"];

    let params;

    if (groups.includes("Admin")) {
      // Admin can see all tasks
      params = {
        TableName: TASKS_TABLE,
      };

      const data = await dynamoDb.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(data.Items),
      };
    } else {
      // Members only see their assigned tasks via GSI
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
        body: JSON.stringify(data.Items),
      };
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
