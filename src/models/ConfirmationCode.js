const mongoose = require('mongoose');

const confirmationCodeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    code: {
        type: Number,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    },
    use: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('ConfirmationCode', confirmationCodeSchema);