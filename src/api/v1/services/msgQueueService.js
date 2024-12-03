const { publishEvent } = require('../../../rabbitmq/rabbitmqPublisher');
// const { MsgQueue } = require("../api/v1/models/msgQueueModelModel");
const { MsgQueuet } = require("../models/msgQueueModel");


exports.saveMsgQueue = async (msg) => { 
    try {
        const messageContent = JSON.parse(msg.content.toString());
        const newMsgQueue = new MsgQueue({
            routingKey: msg.fields.routingKey,
            messageContent: messageContent
        });
        await newMsgQueue.save();
        console.log('Saved msg from RabbitMQ: ', newMsgQueue);
    } catch (err) {
      throw new Error(`Failed to create account: ${err.message}`);
    }
};
  