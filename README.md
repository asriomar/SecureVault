# SecureVault Auth

A modern, full-stack ready authentication system featuring a sleek UI, secure file download area simulation, and AI-powered personalized experiences using Google Gemini.

## 🚀 Features

*   **User Authentication**: Complete Sign Up and Sign In flow with form validation.
*   **Dual-Mode Backend**:
    *   **Mock Mode**: Runs entirely in the browser using `localStorage` for instant demos.
    *   **Real Mode**: Includes a complete Node.js/Express REST API that saves users to a local JSON database.
*   **Secure Download Area**: Protected route accessible only after login.
*   **AI Integration**: Uses Google's Gemini API to generate context-aware, personalized welcome messages for users.
*   **Modern UI/UX**: Built with React, Tailwind CSS, and Lucide icons for a professional aesthetic.

## 🛠️ Tech Stack

**Frontend**
*   React 19
*   Tailwind CSS
*   Lucide React (Icons)
*   Axios
*   Google GenAI SDK

**Backend**
*   Node.js
*   Express.js
*   CORS
*   Native File System (fs) for JSON-based persistence

## 📂 Project Structure

```
├── components/       # Reusable UI components (Input, Button)
├── pages/           # Page views (AuthPage, DownloadPage)
├── server/          # Node.js backend implementation
│   └── server.js    # Express server & JSON DB logic
├── services/        # Service layer communicating with API
│   └── authService.ts # Toggle between Mock and Real API here
├── types.ts         # TypeScript interfaces
├── App.tsx          # Main application & routing logic
└── index.html       # Entry point
```

## 🏁 Getting Started

### Prerequisites
*   Node.js installed on your machine.
*   A Google Gemini API Key (optional, for AI features).

### Installation

1.  Clone the repository or download the source code.
2.  Install dependencies:
    ```bash
    npm install react react-dom express cors axios @google/genai lucide-react
    ```
    *(Note: If running in a web-based IDE, dependencies are typically handled via import maps or internal package managers)*.

### 🏃‍♂️ Running the Application

#### Option 1: Browser-only Demo (Mock Backend)
By default, the application is configured to use a mock backend so it works immediately in the browser without a server.

1.  Open `index.html` via a live server or your preferred bundler.
2.  Register a new user. The data will be saved to your browser's `localStorage`.

#### Option 2: Full Stack Mode (Real Node.js Server)
To use the actual Node.js backend provided in `server/server.js`:

1.  **Start the Backend**:
    Open a terminal and run:
    ```bash
    node server/server.js
    ```
    The server will start on `http://localhost:3001` and create a `db/users.json` file.

2.  **Configure Frontend**:
    Open `services/authService.ts` and change the configuration line:
    ```typescript
    // services/authService.ts
    const USE_MOCK_BACKEND = false; // Change from true to false
    ```

3.  **Run Frontend**: Start your React app. It will now communicate with the local Node.js server.

## 🔑 AI Configuration

To enable the Gemini-powered welcome message:

1.  The application expects the API key to be available in `process.env.API_KEY`.
2.  Ensure this environment variable is set in your runtime environment.

## 🛡️ Security Note

This project is for educational purposes.
*   **Passwords**: In the backend (`server.js`), passwords are stored as plain text for simplicity. In a production environment, **always** hash passwords (e.g., using `bcrypt`) before saving them.
*   **Tokens**: The JWT tokens generated are mocks. Use a real library like `jsonwebtoken` for production apps.
