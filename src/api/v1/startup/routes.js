const express = require('express');

const authRoute = require('../routes/authRoute');
// const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json()); // middleware
    // Built-in Modules (routes handlers)
    app.get("/health", async (req, res) => {
        res.send({ message: "health OK!"});
    });
    app.use('/api/', authRoute);
    // Error handler
    app.use(error);
}