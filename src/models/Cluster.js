const mongoose = require('mongoose');
const uuid = require('uuid');

const nameSchema = mongoose.Schema({
    lang: {
        type: String, length: 2, required: true, unique: true
    },
    value: {
        type: String, max: 255, required: true
    }
});

const emailProfile = mongoose.Schema({
    service: {
        type: String, required : true
    },
    credentials: {
        type: Object, required: true
    },
    from: {
        type: String, required: true
    }
});


// Main
const clusterSchema = mongoose.Schema({
    clusterId: {
        type: String, required: true, default: () => uuid.v4(), unique: true
    },
    names: [nameSchema],
    iconPath: {
        type: String,
    },
    active: {
        type: Number, default: 1, required: true,
    },
    emailProfile: emailProfile
});

module.exports = mongoose.model('Cluster', clusterSchema)