# Stack Overflow Clone

This project is a Stack Overflow-like platform where users can post questions and answers, including features like voting, AI-generated answers, and similarity-based search.

## Features

### Mandatory Requirements

1. **User Registration & Login**:
   - Users can register and log in to the platform.
2. **Question CRUD**:
   - Create, read, update, and delete questions.
3. **Answer CRUD**:
   - Create, read, update, and delete answers.
4. **Question Search**:
   - Search for questions by keywords or related topics.
5. **Edit Requests**:
   - Users can submit edit requests for questions or answers.
   - Owners can approve or reject edit requests.

### Optional Features

1. **Voting System**:
   - Users can vote on questions and answers (upvote/downvote).
2. **AI-Generated Answers**:
   - An AI-generated answer is automatically created whenever a question is posted using open-ai.
3. **Similarity-Based Search**:
   - Search for similar questions using vector-based search using TfIdf.
4. **Dockerization**:
   - The application is Dockerized for easy deployment.

## Installation

### Prerequisites

- Node.js (>=16.x)
- NestJS CLI (optional)
- Docker (if running with Docker)
- MySQL database

### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root of the project with the following values:

   ```env
   DATABASE_HOST=<your_database_host>
   DATABASE_PORT=<your_database_port>
   DATABASE_USER=<your_database_user>
   DATABASE_PASSWORD=<your_database_password>
   DATABASE_NAME=<your_database_name>
   REDIS_HOST=<your_redis_host>
   REDIS_DB=<your_redis_db>
   REDIS_PORT=<your_redis_port>
   OPENAI_API_KEY=<your_openai_api_key>
   EMAIL_USER=<email_username>
   EMAIL_PAS=<email_password>
   AUTH_TOKEN_JWT_SECRET=<your_jwt_secret>
   AUTH_TOKEN_JWT_EXPIRATION=<token_expiration_time>
   AUTH_REFRESH_TOKEN_JWT_SECRET=<your_refresh_jwt_secret>
   AUTH_REFRESH_TOKEN_JWT_EXPIRATION=<refresh_token_expiration_time>
   ```

3. Run database migrations:

   ```bash
   npm run typeorm migration:run
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

5. Access the application at `http://localhost:3000`.

## Running with Docker

1. Build and start the Docker container:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                # Main application modules (auth, questions, answers, etc.)
├── libs/               # Shared libraries and utilities
├── main.ts             # Application entry point
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Log in and obtain tokens.

### Questions

- `POST /questions` - Create a question.
- `GET /questions` - List all questions.
- `GET /questions/:id` - Retrieve a single question.
- `PUT /questions/:id` - Update a question.
- `DELETE /questions/:id` - Delete a question.

### Answers

- `POST /answers` - Create an answer.
- `GET /answers/:id` - Retrieve an answer.
- `PUT /answers/:id` - Update an answer.
- `DELETE /answers/:id` - Delete an answer.

### Voting

- `POST /vote/question/:id` - Vote on a question.
- `POST /vote/answer/:id` - Vote on an answer.

### Similar Questions Search

- `GET /search/questions` - Query base search with filter.
- `GET /search/questions/similar` - Search for similar questions.
