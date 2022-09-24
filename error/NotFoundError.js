const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./CustomApiError');

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.status = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;