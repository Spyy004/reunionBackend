const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const myjwt = require('./../../config/jwt')
const User = require('../models/user');

async function authenticate(req, res) {
  // Validate the request body
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Find the user in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Verify the password
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Generate the JWT token
  const token = myjwt.generateToken({ id: user.id, email: user.email });

  // Return the JWT token
  return res.json({ token });
}


async function getUser(req, res) {
    // Find the user in the database
    const authorizationHeader = req.headers.authorization;

    // Check if authorization header is present
    if (!authorizationHeader) {
      return res.status(401).json({
        error: 'Authorization header is required'
      });
    }
  
    // Extract token from authorization header
    const token = authorizationHeader.split(' ')[1];
  
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Token is invalid'
        });
      }
  
      // Find user by email
      User.findOne({ email: decoded.email }, (err, user) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
      //   console.log("ye user hai mera",user);
        // Return user profile
        res.json({
          name: user.name,
          followers: user.followers?user.followers.length:0,
          followings: user.following?user.following.length:0
        });
      });
    });
  }
  
  async function followUser(req, res) {
    // Find the authenticated user
    const authUser = await User.findById(req.user.id);
    if (!authUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    // Find the user to follow
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    // Check if the authenticated user is already following the user
    if (authUser.following.includes(user.id)) {
      return res.status(400).json({ message: 'You are already following this user.' });
    }
  
    // Add the user to the authenticated user's following list
    authUser.following.push(user.id);
    await authUser.save();
  
    // Add the authenticated user to the user's followers list
    user.followers.push(authUser.id);
    await user.save();
  
    // Return the updated user data
    return res.json(authUser);
  }
  
  async function unfollowUser(req, res) {
    // Find the authenticated user
    const authUser = await User.findById(req.user.id);

    

    if (!authUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Find the user to unfollow
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    // Check if the authenticated user is already following the user
    if (!authUser.following.includes(user.id)) {
      return res.status(400).json({ message: 'You are not following this user.' });
    }
    // Remove the user from the authenticated user's following list

    
    authUser.following = authUser.following.filter(_id => _id != user.id);
    user.followers = user.followers.filter( _id => _id != authUser.id);
  
    await authUser.save();
    
    return res.status(200).json(authUser);
    // Remove
  
}

const createUser = (req, res) => {
    const { email, password, name } = req.body;
  
    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
  
      // Create user document
      const user = new User({
        email: email,
        password: hash,
        name: name
      });
  
      // Save user to database
      user.save((err) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        res.status(201).json({
          message: 'User created successfully'
        });
      });
    });
  };
  
  

module.exports = {
  authenticate,
  getUser,
  followUser,
  unfollowUser,
  createUser
};
