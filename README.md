# Dev-Tinder
Tinder for developer
DevTinder: Developer Collaboration Platform
DevTinder is a specialized matchmaking platform designed for developers to find project collaborators based on tech stack, interests, and mutual interest through a "Swipe & Match" interface.

🚀 Key Features
Skill-Based Suggestions: A "Do You Know" feed that ranks potential matches using skill and interest overlap.

Swipe & Match: Interested/Ignored logic to manage connection requests.

Secure Auth: JWT-based stateless authentication with secure cookie storage.

Account Security: Full Forgot Password/Reset Password workflow and profile management.

Real-time Ready: Designed for Socket.io integration for instant messaging between matches.

🛠 Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose (Indexing, Schema Validation)

Authentication: JSON Web Tokens (JWT), Bcrypt, Cookie-parser

Validation: Validator.js

🏗 System Architecture & Design Patterns
Separation of Concerns: APIs are modularized into separate Routers (Auth, Profile, Request, User) for high maintainability.

Compound Indexing: Implemented in the ConnectionRequest model to prevent duplicate requests and optimize lookup performance.

Auth Middleware: A custom userAuth gatekeeper to protect private routes and attach user context.

Matching Algorithm: A ranking system that calculates the intersection of arrays (Skills/Interests) to boost relevant profiles in the user feed.

📡 API Documentation
1. Auth Router (/auth)
POST /signup: Registers a new user with hashed passwords and validation.

POST /login: Authenticates user and sets a JWT in an HTTP-only cookie.

POST /logout: Clears the authentication cookie to end the session.

2. Profile Router (/profile)
PATCH /profile/edit: Updates user details (bio, skills) using a whitelist of allowed fields.

PATCH /profile/password/change: Updates password for logged-in users (requires old password).

POST /profile/password/forgot: Generates a temporary crypto token and expiry for recovery.

POST /profile/password/reset/:token: Verifies the token and updates the password for unauthenticated users.

3. Request Router (/request)
POST /request/send/:status/:toUserId: Sends a request with status interested or ignored.

POST /request/review/:status/:requestId: Allows the recipient to accept or reject a pending interest.

4. User Router (/user)
GET /user/suggestions: The "Feed" API. Filters out existing connections and ranks users by skill overlap.

GET /user/requests/received: Lists all pending incoming collaboration requests.

GET /user/connections: Lists all developers you have successfully matched/connected with.

🏁 Getting Started
1. Prerequisites
Node.js installed

MongoDB Atlas or local instance running

2. Installation
Bash
# Clone the repository
git clone https://github.com/yourusername/dev-tinder.git

# Install dependencies
npm install

# Setup Environment Variables (.env)
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
3. Running the Server
Bash
# Start in production mode
npm start

# Start with Nodemon for development
npm run dev
🧪 Testing Plan
Postman: Import the API collection to test JWT-protected routes.

Validation Testing: Ensure emailId and photoUrl follow the Validator.js rules.

Edge Case Verification: Test scenarios like sending a request to yourself or double-sending an interest request.

Developed with ❤️ for the Developer Community.