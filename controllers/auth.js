const {StatusCodes} = require('http-status-codes');
const CustomError = require('../error');
const { findOne } = require('../model/User');
const User = require('../model/User');

const register = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    // check if the user, register again with the same email
    const isRegister = await User.findOne({email});
    if(isRegister) {
        throw new CustomError.BadRequestError('user already exist');
    }
    // create user and save in database
    const user = await User.create({name, email, password});
    // create token, so that front end can use for some other request
    const token = user.createJWT();
    // send response, with the user && token
    res.status(StatusCodes.CREATED).json({user, token});
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if( !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    // find user in Database
    const user = await User.findOne({email});
    // if the user not exist/register, send error 
    if(!user) {
        throw new CustomError.UnauthorizedError(`The email you entered isn't connected to an account. Find your account and log in.`)
    }
    // check the password if it's correct, if Not send error
    const isPasswordCorrect = await user.checkPassword(password);
    if(!isPasswordCorrect) {
        throw new CustomError.UnauthorizedError(`The password you've entered is incorrect. Forgot Password ?`);
    }
    // otherwise, the user is already register and password is correct

    // create token, this will use by front end for future request
    const token = user.createJWT();
    // send response, Succesful message
    res.status(StatusCodes.OK).json({msg: `Welcome back ${user.name}!`});
}

const updateProfile = async (req, res) => {

    const {name, lastName, email, location} = req.body;
        if( !name || !lastName || !email || !location) {
        throw new CustomError.BadRequestError('Please fill out all field');
    }
    // find user in database
    const user = await User.findOne({email});
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    // save the changes in the database
    await user.save();
    // create new token
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            lastName: user.lastName,
            location: user.location,
            email: user.email,
            token
        },
        msg: 'User updated'
    });
}

module.exports = {
    register,
    login,
    updateProfile
}