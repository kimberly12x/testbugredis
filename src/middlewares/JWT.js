const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const protect = (req, res, next) => {
  try {
    let token
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRETE_KEY_JWT);
      req.payload = decoded
      next()
    } else {
      res.json({
        message: "Server Need Token Auth"
      })
    }
  } catch (error) {
    console.log(error);
    if (error && error.name === 'JsonWebTokenError') {
      next(new createError(400, 'Token Auth Invalid'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(new createError(400, 'Token Auth Expired'))
    } else {
      next(new createError(400, 'Token Auth Not Active'))
    }
  }
}


const generateToken = (payload) => {
  const verifyOpts = {
      expiresIn: '12h',
      issuer: 'uTicket'
  }
  const token = jwt.sign(payload, process.env.SECRETE_KEY_JWT, verifyOpts)
  return token;
}

const generateRefreshToken = (payload) => {
  const verifyOpts = { expiresIn: '2d' }
  const token = jwt.sign(payload, process.env.SECRETE_KEY_JWT, verifyOpts)
  return token;
}



module.exports = {
  generateToken,
  generateRefreshToken,
  protect
}



