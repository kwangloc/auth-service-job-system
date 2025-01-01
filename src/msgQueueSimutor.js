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
// console.log(`-------------------Start cleaning up queue!-------------------`);
// cleanQueue('job_system_topic', 'auth_service_queue');

const routingKey = 'post.recruiter.addJob';
const msg = {
    recruiterId: '6753f041e3f7f7cc1a7e3106',
    job: {
        _id: '6749127baf4cc669452fbf57',
        title: 'qwe Developer',
        due: '1731643872000',
        status: 'opening'
    }
};

// const routingKey = 'post.recruiter.deleteJob';
// const msg = {
//     recruiterId: '6753f041e3f7f7cc1a7e3106',
//     job: {
//         _id: '6755443e169b9bbe37ca63c5'
//     }
// };

publishEvent(routingKey, msg);

// PORT
// const port = process.env.PORT || 3010;
// app.listen(port, () => console.log('Auth service is listening on port', port));