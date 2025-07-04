const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES();

const TASKS_TABLE = process.env.TASKS_TABLE;
const USER_POOL_ID = process.env.USER_POOL_ID;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Lambda function to notify users about tasks with deadlines reached
exports.handler = async () => {
  try {
    const nowISOString = new Date().toISOString();

    // Scan the tasks table for tasks with deadlines reached and not done
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

    // Check if there are any tasks with deadlines reached
    if (!data.Items || data.Items.length === 0) {
      console.log("No pending tasks with deadline reached");
      return;
    }

    // Iterate through the tasks and send email notifications
    for (const task of data.Items) {
      const username = task.assignedTo;

      let email;

      // Fetch the user's email from Cognito
      try {
        const userData = await cognito
          .adminGetUser({
            UserPoolId: USER_POOL_ID,
            Username: username,
          })
          .promise();

        const emailAttr = userData.UserAttributes.find(
          (attr) => attr.Name === "email"
        );
        email = emailAttr?.Value;

        // If email is not found, log and continue to the next task
      } catch (err) {
        console.error(`Failed to get user ${username} from Cognito`, err);
        continue;
      }

      if (!email) {
        console.log(`No email found for user ${username}`);
        continue;
      }

      // Prepare the email parameters
      const emailParams = {
        Source: SENDER_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: {
            Data: `Task Deadline Alert: ${task.title}`,
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: `Hi ${username},\n\nYour task "${task.title}" is due or overdue.\nStatus: ${task.status}\n\nRegards,\nTask Manager System`,
              Charset: "UTF-8",
            },
          },
        },
      };

      await ses.sendEmail(emailParams).promise();
      console.log(`Email sent to ${email} for task "${task.title}"`);
    }
  } catch (error) {
    console.error("Error in deadline notification:", error);
  }
};
