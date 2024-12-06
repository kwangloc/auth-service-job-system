require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./api/v1/middlewares/logger');
require('./api/v1/startup/logging.js')(logger); // Logging
const app = express();
app.use(cors()); // cho phép tất cả các nguồn gốc

// RabbitMQ
const { consumeEvents } = require('./rabbitmq/rabbitmqConsumer.js');
const { cleanQueue } = require('./rabbitmq/cleanQueue.js');


require('./api/v1/startup/config.js')(); // Config
require('./api/v1/startup/routes.js')(app); // Add routes handlers
require('./api/v1/startup/db.js')(); // Connect to DB

// Environment
console.log(`app: ${app.get('env')}`); // dev env by default

// RabbitMQ
// consumeEvents();
// cleanQueue('job_system_topic', 'auth_service_queue');

// PORT
const port = process.env.PORT || 3010;
app.listen(port, () => console.log('Auth service is listening on port', port));