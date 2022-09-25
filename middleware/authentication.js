const jwt = require('jsonwebtoken');
const CustomError = require('../error');

const authentication = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if(!authHeaders || !authHeaders.startsWith('Bearer ')) {
        throw new CustomError.UnauthorizedError('Authentication Invalid');
    }
    const token = authHeaders.split(' ')[1];
    if(!token) {
        throw new CustomError.UnauthorizedError('Unauthorized to access this route');
    }
    let testuser = '63305377db750dfa5d8c85e5';
    const {userId, name} = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {userId, name, testuser};
    next()
}

module.exports = authentication;