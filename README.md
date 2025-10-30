# SlotSwapper Setup Guide

## Prerequisites

- Node.js
- MongoDB 
- npm 

## Installation

1. Install backend dependencies:
   ```
   cd server
   npm install
   ```

2. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `server` directory
   - Add the following variables:
     ```
     MONGO_URI=mongodb://localhost:27017/slotswapper
     JWT_SECRET=your_jwt_secret_here
     PORT=5000
     ```

## Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
   The server will run on http://localhost:5000

2. Start the frontend client:
   ```
   cd client
   npm start
   ```
   The client will run on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Sign up for a new account or log in with existing credentials
3. Create events on your dashboard
4. Mark events as swappable to allow others to request swaps
5. Browse the marketplace for available slots to swap
6. Check notifications for incoming swap requests
7. Accept or reject swap requests as needed

## Troubleshooting

- Ensure MongoDB is running before starting the server
- Check that all dependencies are installed correctly
- Verify environment variables are set properly
- Make sure ports 3000 and 5000 are not in use by other applications
