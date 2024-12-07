// Modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Logging
// const logger = require('./api/v1/middlewares/logger');
// require('./api/v1/startup/logging.js')(logger); 

// Built-in middlewares
const app = express();
app.use(cors()); 

// RabbitMQ
const { consumeEvents } = require('./rabbitmq/rabbitmqConsumer.js');
const { publishEvent } = require('./rabbitmq/rabbitmqPublisher.js');
const { cleanQueue } = require('./rabbitmq/cleanQueue.js');

// Connect to DB
// require('./api/v1/startup/db.js')(); 

// Environment (dev env by default)
console.log(`app: ${app.get('env')}`); 

// RabbitMQ
consumeEvents();
console.log(`-------------------Start cleaning up queue!-------------------`);
// publishEvent();
// cleanQueue('job_system_topic', 'auth_service_queue');

// PORT
// const port = process.env.PORT || 3010;
// app.listen(port, () => console.log('Auth service is listening on port', port));