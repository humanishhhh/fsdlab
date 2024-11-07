const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample posts
const posts = [
  { name: "CBIT", title: "Welcome to CBIT" },
  { name: "MGIT", title: "Welcome to MGIT" }
];

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token
  if (!token) return res.sendStatus(401); // Unauthorized if no token

  // Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token invalid
    }
    req.user = user;
    next(); // Call next middleware
  });
};

// Login route to get JWT token
app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username }; // User object

  // Sign the JWT token
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);

  // Send the token as response
  res.json({ accessToken: accessToken });
});

// Use the authenticateToken middleware on protected routes
app.use(authenticateToken);

// Protected route to get posts based on the user
app.get('/posts', (req, res) => {
  console.log(req.user.name); // Log the authenticated user name
  res.json(posts.filter(post => post.name === req.user.name)); // Filter posts by user
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
