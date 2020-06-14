const mongoose = require('mongoose');
const uuid = require('uuid');


const lastConnections = {
    ip: {
        type: String,
        required: true
    },
    at: {
        type: Date,
        required: true,
        default: Date.now()
    }
}

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: () => uuid.v4(),
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        max: 255
    },

    email: {
        type: String,
        required: true,
        max: 255
    },
    phone: {
        type: String,
        required: false,
        max:255
    },
    username: {
        type: String,
        required: false,
        max:255
    },
    clusterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: 'Cluster'
    },
    properties: {
        type: Object,
        required: false,
        default: {
            "random": null
        }
    },


    password: {
        type: String,
        required: true
    },
    active: {
        type: Number, default: 1, required: true,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: null
    },
    emailVerifiedAt: {
        type: Date,
        required: false,
        default: null
    },
    phoneVerifiedAt: {
        type: Date,
        required: false
    },

    lastIp: {
        type: String,
        required: true
    },
    lastConnectionAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    lastConnections: [lastConnections]

});


module.exports = mongoose.model('User', userSchema);