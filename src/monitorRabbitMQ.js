// Modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Built-in middlewares
const app = express();
app.use(cors()); 

// RabbitMQ
const { consumeEvents } = require('./rabbitmq/rabbitmqConsumer.js');
const { publishEvent } = require('./rabbitmq/rabbitmqPublisher.js');
const { cleanQueue } = require('./rabbitmq/cleanQueue.js');

// Environment (dev env by default)
console.log(`app: ${app.get('env')}`); 

// RabbitMQ
// consumeEvents();
console.log(`-------------------Start cleaning up queue!-------------------`);
// publishEvent();
cleanQueue('job_system_topic', 'user_service_queue');