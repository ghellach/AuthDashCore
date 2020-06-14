const mongoose = require('mongoose');
const uuid = require('uuid');

const connectionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Application'
    },
    connectionId: {
        type: String,
        required: true,
        default: () => uuid.v4(),
        unique: true
    },
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    minutes: {
        type: Number,
        required: true,
        default: 60
    },
    activated: {
        type: Boolean,
        required: true,
        default: false
    },
    revoked: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Connection', connectionSchema);