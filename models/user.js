

const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: String,
        default: ''
    },
    edad: {
        type: Number,
        default: 0
    },
    genero: {
        type: String,
        default: ''
    },
    verify: {
        type: Boolean,
        default: false
    },
});

UserSchema.method('toJSON', function() {
    const { __v, _id, password, verify, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('User', UserSchema);