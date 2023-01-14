const { Schema, model } = require('mongoose')

const schema = new Schema({
        id: { type: Number, required: true },
        science: { type: Number, required: true, default: 20, min: 0},
        science_use: { type: Number, required: true, default: 0},
        help: {type: Array, required: true, default: []},
        progress: {type: Array, required: true, default: []},
        lvl: { type: Number, required: true, default: 1},
        date: {type: Date, required: true, default: Date.now},
        help_limit: {type: Number, required: true, default: 0},
        vibration: {type: Boolean, required: true, default: true},
        sound: {type: Boolean, required: true, default: true},
        don: {type: Boolean, required: true, default: false},
        sub: {type: Boolean, required: true, default: false},
        post: {type: Boolean, required: true, default: false},
        reload: {type: Boolean, required: true, default: false},
})

module.exports = model('User', schema)