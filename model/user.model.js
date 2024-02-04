const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { validateEmail } = require("../utils/validators")
const { UserRegisterType } = require("../utils/constants")
const UserSchema = new mongoose.Schema({

    uid: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    last_name: {
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
    company_email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    company_name: {
        type: String,
        trim: true,
    },
    company_number: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    nid: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    zip_code: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    tobacco: {
        type: String,
        trim: true,
    },
    resale: {
        type: String,
        trim: true,
    },
    fein: {
        type: String,
        trim: true,
    },
    tobacco_images: {
        type: String,
        trim: true,
    },
    resale_images: {
        type: String,
        trim: true,
    },
    fein_images: {
        type: String,
        trim: true,
    },
    nid_images: {
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
    approved: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    }
}, { timestamps: true })

module.exports = {
    UserModel: mongoose.model('User', UserSchema),
}



