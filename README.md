# 🗂️ Task Manager App

A full-stack serverless Task Management System for field teams. Admins can create and assign tasks to team members. Members can view and update their tasks. The system also tracks deadlines and sends notifications.

---

## The live application link:

```
https://main.dtpj1l0uqgd70.amplifyapp.com
```

**The login Details**:

1.  **Admin User**:

    - **Username**:

    ```
    zethtaskadmin

    ```

    - **Password**:

    ```
    vT649S6J!tpR8.e

    ```

2.  **Member User**:

    - **Username**:

    ```
    zethapp2user
    ```

    - **Password**:

    ```
    Zap12345!
    ```

## 📦 Stack Overview

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Frontend      | React + Vite + Tailwind CSS              |
| Auth          | AWS Cognito User Pool                    |
| Backend       | AWS Lambda (Node.js) + API Gateway (SAM) |
| Database      | DynamoDB                                 |
| Notifications | AWS SES                                  |
| CI/CD         | GitHub + Amplify                         |

---

## 🔐 Roles

- **Admin** – Can create tasks and assign to members, view all tasks, and monitor deadlines.
- **Member** – Can view and update their own assigned tasks, check deadlines.

---

## 📁 Folder Structure

```
DevOps-Task-Manager-App-With-AWS-SAM-And-AWS-Amplify/
├── my-task-manager-backend/   # SAM-based Lambda backend
├── my-task-manager-frontend/  # React + Amplify frontend
```

---

## 🧱 Architecture Diagram

### Overall System Architecture

```plaintext
+-----------+       +---------------------+       +----------------+
|  Frontend | <---> | API Gateway (Auth)  | <---> |  Lambda (SAM)  |
|  React    |       | + Cognito Authorizer|       | - createTask   |
+-----------+       +---------------------+       | - getTasks     |
                                                  | - updateStatus |
                    +---------------------+       | - deadlineCheck|
                    |   DynamoDB (Tasks)  |       +----------------+

                          |
                    +----------------+
                    | SES Notifications |
                    +----------------+
```

---

## 🚀 Features

### ✅ Admin

- Create tasks (title, description, assignee, deadline)
- View all tasks
- View overdue tasks

### ✅ Member

- View assigned tasks
- Update task status (e.g., In Progress, Completed)
- See overdue tasks

---

## 🧠 Backend (AWS SAM)

### Deployment

```bash
cd my-task-manager-backend
sam build
sam deploy --guided
```

You will get an API URL like:

```
https://<api-id>.execute-api.<region>.amazonaws.com/Prod/
```

### Key Lambda Functions

- `createTask.handler`
- `getTasks.handler`
- `updateTaskStatus.handler`
- `notifyOnDeadline.handler` (runs daily)

### Resources

- **TasksTable** – DynamoDB for storing task data
- **TaskNotificationTopic** – SNS topic for future notifications
- **CognitoAuth** – API Gateway Authorizer using Cognito

---

## 💻 Frontend (React + Amplify)

### Setup

```bash
cd my-task-manager-frontend
npm install
npm run dev
```

### Key Pages

- `/` – Redirects to dashboard based on user group
- `/create` – Admin: create tasks
- `/tasks` – View tasks
- `/update` – Member: update status
- `/deadlines` – View overdue tasks

### Cognito Integration

Use `amplify import auth` to link your Cognito User Pool.

---

## ✅ Creating a New User

1. Sign up using the web form.
2. New users are auto-assigned to the `Member` group via a PostConfirmation Lambda trigger.
3. Admins can manually move users to the `Admin` group via AWS Console.

---

## 🔧 Manual Tasks, Yet to be Automated in Code

- ✅ Add `Member` and `Admin` groups to Cognito
- ✅ Add PostConfirmation Lambda to auto-assign group

---

## 📬 API Endpoints

| Method | Endpoint                 | Description                                      |
| ------ | ------------------------ | ------------------------------------------------ |
| POST   | `/tasks`                 | Create a new task                                |
| GET    | `/tasks`                 | Get all tasks (admin) or assigned tasks (member) |
| PUT    | `/tasks/{taskId}/status` | Update task status                               |

---

## 📅 Scheduled Function

The `notifyOnDeadline.handler` runs daily to scan for overdue tasks (extendable to trigger email/SES).

---

## 🧪 Testing

- ✅ Sign in as Admin → Create tasks
- ✅ Sign in as Member → View assigned tasks
- ✅ Try overdue task scenarios
- ✅ Check CloudWatch logs if errors occur

---

## 🛡️ Security

- All API routes secured with Cognito Authorizer
- Group-based route filtering in frontend
- Role separation strictly enforced via token

---

## 🤝 Contributing

1. Fork the repo
2. Clone and create a feature branch
3. Submit a pull request

---

## 📜 License

MIT License © 2025

---

## 👤 Author

Developed using AWS Serverless by `Seth Anmawen`.
