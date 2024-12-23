// import "dotenv/config"; 
// require('dotenv').config();
const { getRabbitMQConnection } = require('./rabbitmqConnection');

async function publishEvent(routingKey, msg) {
    try {
        const connection = await getRabbitMQConnection();
        const channel = await connection.createChannel();

        const exchange = process.env.RABBITMQ_EXCHANGE || 'job_events_topic_5'; 

        const message = JSON.stringify(msg);

        channel.publish(exchange, routingKey, Buffer.from(message), {
            persistent: true 
        });

        console.log(`Published message: ${routingKey}`, msg);

        await channel.close();
    } catch (error) {
        console.error('Failed to publish event:', error);
    }
}

module.exports = { publishEvent };
