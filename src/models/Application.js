const mongoose = require('mongoose');
const Cluster = require('./Cluster');
const uuid = require('uuid');

const nameSchema = mongoose.Schema({
    lang: {
        type: String, length: 2, required: true, unique: true
    },
    value: {
        type: String, max: 255, required: true
    }
});

const applicationSchema = mongoose.Schema({
    names: [nameSchema],

    // Authentication
    appId: {
        type: String, required: true, default: () => uuid.v4(), unique: true
    },
    appSecret: {
        type: String, required: true, default: () => uuid.v4(), unique: true
    },
    clusterId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Cluster'
    },
    active: {
        type: Number, required: true, default: true
    },

    // Style
    color: {
        type: String, required: true, default: 'red'
    },
    backgroundColor: {
        type: String, required: true, default: '#E8E8E8'
    },
    backgroundImage: {
        type: String, required: false
    },
    iconPath: {
        type: String, required: true, default: '/application/icons/placeholder.jpg'
    }

});

module.exports = mongoose.model('Application', applicationSchema);