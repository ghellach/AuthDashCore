const mongoose = require('mongoose');const uuid = require('uuid');


const nameSchema = mongoose.Schema({
    lang: {
        type: String, length: 2, required: true, unique: true
    },
    value: {
        type: String, max: 255, required: true
    }
});


// Main
const clusterSchema = mongoose.Schema({
    clusterId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Cluster'
    },
    names: [nameSchema],
    iconPath: {
        type: String,
    },
    active: {
        type: Number, default: 1, required: true,
    }
});

module.exports = mongoose.model('Cluster', clusterSchema)