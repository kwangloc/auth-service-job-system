require('dotenv').config();

const express = require('express');
const logger = require('./api/v1/middlewares/logger');
require('./api/v1/startup/logging.js')(logger); // Logging
const app = express();

// RabbitMQ
const { consumeEvents } = require('./rabbitmq/rabbitmqConsumer.js');

require('./api/v1/startup/config.js')(); // Config
require('./api/v1/startup/routes.js')(app); // Add routes handlers
require('./api/v1/startup/db.js')(); // Connect to DB

// Environment
console.log(`app: ${app.get('env')}`); // dev env by default
// RabbitMQ
consumeEvents();
// PORT
const port = process.env.PORT || 3010;
app.listen(port, () => console.log('Auth service is listening on port', port));