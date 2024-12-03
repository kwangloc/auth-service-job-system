// const { Account, validateAccount } = require("../api/v1/models/accountModel");
const { MsgQueue } = require("../api/v1/models/msgQueueModelModel");
const authService = require('../api/v1/services/authService');
const msgQueueService = require('../api/v1/services/msgQueueService');

const { getRabbitMQConnection } = require('./rabbitmqConnection');

async function consumeEvents() {
    try {
        const connection = await getRabbitMQConnection();
        const channel = await connection.createChannel();

        // const exchange = 'job_events_topic_5';
        const exchange = process.env.RABBITMQ_EXCHANGE || 'job_events_topic_5';
        
        const queue = process.env.RABBITMQ_QUEUE || 'auth_service_queue';  
        await channel.assertQueue(queue, { durable: true });
        // await channel.bindQueue(queue, exchange, 'user.account.*');  
        await channel.bindQueue(queue, exchange, '#');  // logging all messages

        console.log(`Waiting for messages in ${queue}`);

        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log('Received message:', msg.fields.routingKey, messageContent);
                msgQueueService.saveMsgQueue(msg);
                if (msg.fields.routingKey.startsWith('user.account')) {
                    handleUserEvent(msg.fields.routingKey, messageContent);
                } 

                // handleJobEvent(msg.fields.routingKey, messageContent);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Failed to consume job events:', error);
    }
}

// Messages handler function
async function handleUserEvent(routingKey, user) {
    if (routingKey === 'user.account.created') {
        // val user
        try {
            const res = await authService.createAccount(user);
            console.log(res);
            console.log(`User ${user.id} was created. Updating user preferences...`);
        } catch (error) {
            console.error('Failed to create new account:', error);
        }
        
    } else if (routingKey === 'user.account.updated') {
        const res = await authService.updateAccountInternal(user);
        console.log(res);
        console.log(`Account with userId ${user.userId} was updated. Updating user preferences...`);

    } else if (routingKey === 'user.account.deleted') {
        const res = await authService.delAccountByUserIdInternal(user.userId);
        console.log(res);
        console.log(`Account with userId ${user.userId} was deleted. Updating user preferences...`);
    }
}

module.exports = { consumeEvents };
