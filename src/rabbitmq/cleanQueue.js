// const { Account, validateAccount } = require("../api/v1/models/accountModel");
const { MsgQueue } = require("../api/v1/models/msgQueueModel");
const authService = require('../api/v1/services/authService');
const msgQueueService = require('../api/v1/services/msgQueueService');

const { getRabbitMQConnection } = require('./rabbitmqConnection');

async function cleanQueue(exchange_name, queue_name) {
    try {
        const connection = await getRabbitMQConnection();
        const channel = await connection.createChannel();

        // const exchange = 'job_events_topic_5';
        const exchange = process.env.RABBITMQ_EXCHANGE || exchange_name;
        
        const queue = process.env.RABBITMQ_QUEUE || queue_name;  

        console.log('Exchange:', exchange);
        console.log('Queue::', queue);

        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, '#');  // get all type of messages
        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                // const messageContent = msg.content.toString();
                // const messageContent = msg.content;

                console.log('Received message:', msg.fields.routingKey, messageContent);
                // msgQueueService.saveMsgQueue(msg.fields.routingKey, messageContent);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Failed to consume rabbitmq events:', error);
    }
}

module.exports = { cleanQueue };
