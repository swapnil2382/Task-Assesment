# -----------------------
# Backend Setup
# -----------------------

# Navigate to the backend folder
cd server

# Install dependencies
npm install

# Create a .env file (use .env.example as template)
# Add the following variables:
# MONGO_URI=<your-mongodb-connection-string>
# JWT_SECRET=<your-jwt-secret>

# Start the backend server
npm start

# -----------------------
# Frontend Setup
# -----------------------

# Open a new terminal and navigate to the frontend folder
cd client

# Install dependencies
npm install

# Start the frontend development server
npm start
