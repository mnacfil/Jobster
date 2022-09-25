const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: [50, 'Oops you reach maximum characters'],
        minlength: [3, 'username must be atleast 3 character'],
        trim: true
    },
    lastName: {
        type: String,
        default: 'last name',
        trim: true
    },
    location: {
        type: String,
        default: 'city',
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [8, 'password must be atleast 8 characters'],
    },
},
    { timestamps: true}
)

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userId: this._id,
            name: this.name
        }, process.env.JWT_SECRET,
        {
        expiresIn: process.env.JWT_EXPIRATION
        }
    )
}

UserSchema.methods.checkPassword = async function(password) {
    const isCorrect = await bcrypt.compare(password, this.password);
    return isCorrect;
}

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model('User', UserSchema);