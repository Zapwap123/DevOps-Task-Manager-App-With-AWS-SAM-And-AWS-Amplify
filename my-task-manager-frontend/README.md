# Task Manager Frontend - Setup & Development Documentation

This document outlines the steps taken to create and set up the Task Manager frontend using React and AWS services.

## Project Initialization

### 1. Create React App

```bash
npx create-react-app my-task-manager-frontend
cd my-task-manager-frontend
```

### 2. React Cleanup

- Removed unnecessary files: `App.test.js`, `logo.svg`, `reportWebVitals.js`, etc.
- Cleaned up `App.js` to prepare for custom component integration.
- Set up folder structure:
  ```
  src/
  ├── components/
  ├── pages/
  ├── api.js
  ├── auth.js
  ├── index.js
  └── App.js
  ```

## AWS Amplify Setup

### 3. Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 4. Initialize Amplify Project

```bash
amplify init
```

- Enter project name, environment, and default editor.
- Choose React as the framework.
- Select the default AWS profile.

### 5. Add Authentication

```bash
amplify add auth
```

- Default configuration with email as the sign-in method.

### 6. Add Hosting

```bash
amplify add hosting
```

- Select `Hosting with Amplify Console` and follow the prompts.

### 7. Deploy to AWS

```bash
amplify publish
```

- Amplify builds and deploys the frontend to a live URL.

## Development Process

### 8. Create Components

- `TaskList.js`: for displaying tasks

### 9. Setup Context

- `auth.js`: to manage user authentication state

### 10. Connect to Backend API

- Created service files to make requests to AWS API Gateway endpoints.
- Used `fetch` or `axios` to perform CRUD operations on tasks.

### 12. Final Test and Deployment

- Verified all features locally.
- Ran `amplify publish` again to deploy the final version.

## Conclusion

This setup ensures a scalable and secure serverless React app integrated with AWS services including Cognito for authentication, Amplify for hosting, API Gateway & Lambda for backend, and DynamoDB for data storage.
