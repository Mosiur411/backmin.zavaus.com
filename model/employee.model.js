const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { validateEmail } = require("../utils/validators")
const { UserRegisterType } = require("../utils/constants")
const EmployeeSchema = new mongoose.Schema({
    uid: {
        type: String,
        trim: true,
        ref: 'Development',
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: {
            validator: validateEmail,
            message: props => `${props.value} is not a valid email`
        },
    },
    password: {
        type: String,
        trim: true,
    },
    phone: {
        type: Number,
        trim: true,
    },
    nid: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    country: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    zip_code: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        validate: {
            validator: function (role) {
                return UserRegisterType.has(role)
            },
            message: props => `${props.value} is not a valid role`
        },
        required: true
    },
}, { timestamps: true })

module.exports = {
    EmployeeModel: mongoose.model('Employee', EmployeeSchema),
}