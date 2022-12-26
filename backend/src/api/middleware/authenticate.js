const jwt = require('jsonwebtoken');


function authenticate(req, res, next) {
  // Get the JWT token from the request header
  let token = req.header('Authorization').split(' ')[1];


  // If there is no token, return a 401 unauthorized error
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    // If there is a token, verify it and decode the payload
    const decoded  = jwt.verify(token,process.env.JWT_SECRET);
    // Add the decoded payload to the request object
    req.user = decoded;

    // Call the next middleware function
    next();
  } catch (ex) {
    console.log(token,"here is token bro");
    // If the token is invalid, return a 400 bad request error
    res.status(400).send('Invalid token.');
  }
}

module.exports = authenticate;
