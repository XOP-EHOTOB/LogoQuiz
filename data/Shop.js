const { Schema, model } = require('mongoose')

const schema = new Schema({
        order_id: { type: Number, required: true },
        status: { type: Number, required: true },
        date: {type: Date, required: true, default: Date.now},
})

module.exports = model('Shop', schema)