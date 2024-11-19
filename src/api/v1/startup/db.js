const logger = require('../middlewares/logger');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

module.exports = function() {
    if (!mongoUri) {
        const error = new Error("process.env.MONGODB_URI not found!");
        error.statusCode = 500;
        throw error;
    }
    mongoose.connect(mongoUri)
        .then(() => logger.info('AuthService connected to database'))
}