require('dotenv').config()

const mongoose = require('mongoose')
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('db connected...');
    } catch (e) {
        console.log(e);
    }
}

start()

require('./server/routes/get_user')
require('./server/routes/get_games')