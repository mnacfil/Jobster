const CustomError = require('../error');

const testuser = (req, res, next) => {
    // restrict the user to read only, by putting this middleware to
    // update, create, job routes
    if(req.user.testuser) {
        throw new CustomError.BadRequestError('Oops! You are only allowed to read only!')
    }
}

module.exports = testuser;