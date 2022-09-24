const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./CustomApiError');

class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;