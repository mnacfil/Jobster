const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./CustomApiError');

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.status = StatusCodes.U;
    }
}

module.exports = UnauthenticatedError;