# chatChamber - a chat application 📱💬

A real-time chat application built using the **MERN stack** and **Socket.IO**, featuring end-to-end encryption, timestamped messages, and support for creating and managing chat channels.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Challenges and Learnings](#challenges-and-learnings)
- [Future Scope](#future-scope)
- [License](#license)

---

## Features
- **Real-Time Messaging**: Users can send and receive messages instantly.
- **Channels**: Create and join channels for group conversations.
- **Timestamps**: Display the timestamp for every message.
- **File Transfer**: Transfer images and other files securely.
- **Responsive UI**: Optimized for both desktop and mobile devices.

---

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO
- **File Upload**: Multer
- **State Management**: Zustand
- **Deployment**: Vercel (frontend and backend)

---

## Installation
### Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally or a MongoDB cloud instance

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/prashantsaxe/chatChamber.git
   cd chat-app

2. Install dependencies for both the server and client:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install

3. Set up environment variables:
   - Create a .env file in the server directory with the following content:
      ```bash
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret

4. Start the server:
   ```bash
   cd server
   npm start

5. Start the client:
   ```bash
   cd ../client
   npm start

6. Open your browser and navigate to http://localhost:5173 to use the application.






