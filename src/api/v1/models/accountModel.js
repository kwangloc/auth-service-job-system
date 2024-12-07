const Joi = require("joi");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // json web token

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlengh: 1024 // hash password
    },
    name: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    createdBy: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});


accountSchema.methods.generateAuthToken = function() {
    // const token = jwt.sign({_id: this._id, userId: this.userId, email: this.email, name: this.name, role: this.role}, process.env.JWT_PRIVATE_KEY);
    const token = jwt.sign({_id: this.userId, email: this.email, role: this.role}, process.env.JWT_PRIVATE_KEY);
    return token;
}

// model
const Account = new mongoose.model('Account', accountSchema);

// Functions
function validateAccount(account) {
    const schema = Joi.object({
        userId: Joi.string().hex().length(24).required(),
        email: Joi.string().min(2).max(255).required().email(), // plain password
        password: Joi.string().min(6).max(1024).required(),
        name: Joi.string().min(1).required(),
        role: Joi.string().min(1).required(),
        createdBy: Joi.string().min(1).required()
    });
    return schema.validate(account);;
}

module.exports = {
    accountSchema,
    Account,
    validateAccount
};