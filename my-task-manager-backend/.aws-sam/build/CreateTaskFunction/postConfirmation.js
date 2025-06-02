// postConfirmation/index.js
const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const userPoolId = process.env.USER_POOL_ID;
  const username = event.userName;
  const groupName = "Member";

  const params = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognito.adminAddUserToGroup(params).promise();
    console.log(`User ${username} added to group ${groupName}`);
  } catch (err) {
    console.error("Error adding user to group:", err);
  }

  return event;
};
