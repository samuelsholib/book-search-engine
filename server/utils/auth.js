const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {

signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },


  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, headers, or req.query
    let token = req.body.token || req.headers.authorization || req.query.token;

    // separate Bearer from token value

    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim()
    }
    // if no token return the request object
    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch { console.log('Invalid token') }

    // return updated request object
    return req;
  }
}
