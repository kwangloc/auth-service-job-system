const { publishEvent } = require('../../../rabbitmq/rabbitmqPublisher');
// const { MsgQueue } = require("../api/v1/models/msgQueueModelModel");
const { MsgQueue } = require("../models/msgQueueModel");


exports.saveMsgQueue = async (routingKey, messageContent) => { 
    try {
        // const messageContent = JSON.parse(msg.content.toString());
        // const messageContent = msg.content.toString();
        const newMsgQueue = new MsgQueue({
            routingKey: routingKey,
            messageContent: messageContent
        });
        await newMsgQueue.save();
        console.log('Saved msg from RabbitMQ: ', newMsgQueue);
    } catch (err) {
      throw new Error(`Failed to create account: ${err.message}`);
    }
};
  