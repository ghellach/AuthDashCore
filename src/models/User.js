const mongoose = require('mongoose');
const uuid = require('uuid');

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
    country: {
        type: String,
        required: true,
        length: 2
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
    },
    active: {
        type: Number, default: 1, required: true,
    }

});

module.exports = mongoose.model('User', userSchema);