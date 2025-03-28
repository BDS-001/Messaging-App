# ChatSphere

ChatSphere is a full-stack web messaging application that allows users to communicate in real-time. Built with a React frontend and Node.js backend, this application provides a seamless messaging experience with features like direct messaging, group chats, and contact management.

## Features

### Core Functionality
- **User Authentication** - Secure signup and login system
- **Direct Messaging** - Send and receive messages in one-on-one conversations
- **Group Chats** - Create and manage group conversations
- **Contact Management** - Add, edit, and remove contacts
- **Profile Customization** - Update username and account settings

### Additional Features
- **Real-time Updates** - Messages appear instantly (using polling)
- **Message History** - View and clear chat history
- **User Search** - Find and add new contacts
- **Group Management** - Add/remove users from group chats
- **Responsive Design** - Works on both desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Navigation and routing
- **CSS Modules** - Styling
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
./
├── backend-messaging/       # Server-side code
│   ├── app.js              # Main application entry point
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── prisma/             # Database schema and queries
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   └── validators/         # Request validation
├── frontend-messaging/     # Client-side code
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React Context providers
│       ├── hooks/          # Custom React hooks
│       ├── layouts/        # Page layouts
│       ├── pages/          # Main page components
│       ├── provider/       # Context API providers
│       ├── routes/         # Route configuration
│       └── services/       # API service functions
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/chatsphere.git
cd chatsphere
```

2. Set up the backend
```bash
cd backend-messaging
npm install

# Create a .env file with the following variables
# DATABASE_URL="postgresql://username:password@localhost:5432/chatsphere"
# JWT_SECRET="your-secret-key"
# USE_PORT=3000
# SEED_DATABASE="true" (if you want to seed the database with test data)

# Run database migrations
npx prisma migrate dev

# Start the server
npm start
```

3. Set up the frontend
```bash
cd ../frontend-messaging
npm install

# Start the development server
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/auth` - Get current user

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get a user by ID
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users` - Delete the current user

### Chats
- `GET /api/v1/chats` - Get all chats for the current user
- `GET /api/v1/chats/:chatId` - Get chat messages
- `POST /api/v1/chats` - Create a new chat
- `PUT /api/v1/chats/:chatId` - Update a chat

### Messages
- `POST /api/v1/messages` - Send a message
- `PUT /api/v1/messages/:id` - Update a message
- `DELETE /api/v1/messages/:id` - Delete a message

### Contacts
- `GET /api/v1/contacts` - Get user contacts
- `POST /api/v1/contacts` - Add a contact
- `PUT /api/v1/contacts/:contactId` - Update a contact
- `DELETE /api/v1/contacts/:contactId` - Remove a contact

## Future Enhancements

- **Real-time Messaging** - Implement WebSockets for true real-time communication
- **Media Sharing** - Allow sending images and files in chats
- **Online Status** - Show when users are active
- **Message Reactions** - Add emoji reactions to messages
- **End-to-End Encryption** - Enhance security with message encryption
- **Mobile App** - Create native mobile applications

## Acknowledgments

- This project was created as a learning exercise
- Inspired by popular messaging applications like WhatsApp, Discord, and Telegram