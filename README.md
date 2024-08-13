# Vehicle Driver Assignment Dashboard

## Overview

This project is a web-based dashboard application designed to manage drivers, vehicles, and assignment requests. The application provides a comprehensive overview of the system's state, including the total number of drivers, vehicles, and recent activities. It also allows for scheduling and job management to handle vehicle assignments over specific time periods.

## Features

- **Dashboard Overview**: Provides a quick view of total drivers, vehicles, and recent activity.
- **Driver Management**: Manage drivers, including viewing the most recently added drivers.
- **Vehicle Management**: Manage vehicles, including viewing the most recently added vehicles.
- **Request Management**: View and manage assignment requests, including the most recent requests and their statuses.
- **Scheduling Jobs**: Automate vehicle assignment and reset tasks using scheduled jobs.
  
## Tech Stack

- **Frontend**:
  - React.js
  - Tailwind CSS
  - DaisyUI
  - React Query
  - React Hook Form

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (Mongoose)
  - Axios
  - Agenda (for job scheduling)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone <repo_url>
    cd motorq-assignment
    ```

2. Install the dependencies: for both client and server

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root of the client and add the following:

    ```bash
    VITE_TINYMCE_API_KEY=
    VITE_GOOGLE_CLIENT_ID=
    ```

     Create a `.env` file in the root of the server and add the following:

    ```bash
    PORT = 8000
    MONGO_DB_URL = 
    ALLOWED_ORIGINS = http://localhost:5173

    ACCESS_TOKEN_SECRET = 
    ACCESS_TOKEN_EXPIRY = 1d

    REFRESH_TOKEN_SECRET = 
    REFRESH_TOKEN_EXPIRY = 4d

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    GOOGLE_CLIENT_ID=

    ```

4. Run the application: for both client and server

    ```bash
    npm run dev
    ```

6. Access the application in your browser:

    ```
    http://localhost:5173
    ```

