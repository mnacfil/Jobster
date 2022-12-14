const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    console.log('====ERROR-HANDLER-MIDDLEWARE=====')
    const customError = {
        status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, Please try again later'
    }
    // for error return by mongoose validation
    if(err.name === 'ValidationError') {
        customError.status = StatusCodes.BAD_REQUEST;
        customError.message = Object.values(err.errors).map(item => item.message).join(', ');
    }
    // if the syntax of objectID is different
    if(err.name === 'CastError') {
        customError.status = StatusCodes.NOT_FOUND;
        customError.message = `No job found with id : ${err.value}`
    }
    return res.status(customError.status).json({msg: customError.message})
    res.status(customError.status).json({msg: err})
}

module.exports = errorHandler