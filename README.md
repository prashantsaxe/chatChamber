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

## Usage
- **Sign Up or Log In**: Create a new account or log in with an existing one.
- **Channels**: Create or join channels to start group conversations.
- **Real-Time Messaging**: Send and receive messages instantly.
- **File Transfer**: Securely upload and share images and other files.
- **Timestamps**: View timestamps for all messages to track communication.

---

## Architecture
The application follows a typical MERN stack architecture:

- **Frontend**: Built with React.js and styled using Tailwind CSS.
- **Backend**: Built with Node.js and Express.js, providing RESTful API endpoints.
- **Database**: MongoDB is used to store user data, messages, and channels.
- **Real-Time Communication**: Socket.IO is used for real-time messaging.
- **File Upload**: Multer is used for handling file uploads.

---

## API Endpoints
### Authentication
- **POST /api/auth/signup**: Sign up a new user.
- **POST /api/auth/login**: Log in an existing user.
- **GET /api/auth/get-userInfo**: Retrieve user information.
- **POST /api/auth/update-profile**: Update user profile details.
- **POST /api/auth/add-profile-image**: Add a profile image.
- **DELETE /api/auth/delete-profile-image**: Delete a profile image.
- **POST /api/auth/logout**: Log out a user.

### Messages
- **POST /api/messages/get-messages**: Retrieve messages for a chat.
- **POST /api/messages/upload-file**: Upload a file to a chat.

### Channels
- **POST /api/channels/create-channel**: Create a new channel.
- **GET /api/channels/get-user-channels**: Retrieve all channels for a user.
- **GET /api/channels/get-channel-messages/:channelId**: Get all messages for a specific channel.

### Contacts
- **POST /api/contacts/search**: Search for contacts.
- **GET /api/contacts/get-contacts-for-dm**: Retrieve contacts for direct messaging.
- **GET /api/contacts/get-all-contacts**: Retrieve all contacts.

---

## Challenges and Learnings
- Implementing real-time messaging with Socket.IO.
- Ensuring secure file transfer and storage.
- Managing state efficiently with Zustand.
- Deploying the application seamlessly on Vercel.

---

## Future Scope
- Implementing **end-to-end encryption** for messages.
- Adding support for **video and voice calls**.
- Enhancing the UI/UX for a better user experience.
- Adding more customization options for channels and messages.

---

## License
This project is licensed under the **MIT License**.

---

## Images
- **Profile**: ![Profile Image](https://github.com/prashantsaxe/Images/blob/main/Screenshot%202025-01-07%20000114.png)
- **One-to-One Chat**: ![One-to-One Chat Image](https://github.com/prashantsaxe/Images/blob/main/Screenshot%202025-01-07%20000016.png)
- **Channel Chat**: ![Channel Chat Image](https://github.com/prashantsaxe/Images/blob/main/Screenshot%202025-01-06%20235940.png)



