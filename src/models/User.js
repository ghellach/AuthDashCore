const mongoose = require('mongoose');
const Cluster = require('./Cluster');
const uuid = require('uuid');

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: () => uuid.v4()
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
    clusterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: 'Cluster'
    },


    password: {
        type: String,
        required: true
    },active: {
        type: Number, default: 1, required: true,
    }

});

module.exports = mongoose.model('User', userSchema);