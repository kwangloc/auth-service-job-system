const mongoose = require('mongoose');

const msgQueueSchema = mongoose.Schema({
    routingKey: {
        type: String,
        required: true
    },
    messageContent: {
        type: Object,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

// model
const MsgQueue = new mongoose.model('MsgQueue', msgQueueSchema);

module.exports = {
    msgQueueSchema,
    MsgQueue,
};