const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

// Lambda function to add a user to the "Member" group after confirmation
exports.handler = async (event) => {
  const userPoolId = process.env.USER_POOL_ID;
  const username = event.userName;
  const groupName = "Member";

  const params = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  // Add the user to the "Member" group
  try {
    await cognito.adminAddUserToGroup(params).promise();
    console.log(`User ${username} added to group ${groupName}`);
  } catch (err) {
    console.error("Error adding user to group:", err);
  }

  return event;
};
