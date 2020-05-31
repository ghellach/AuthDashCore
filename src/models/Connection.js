const mongoose = require('mongoose');

const connectionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: 'User'
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        rel: 'Application'
    },
    token: {
        
    }
});