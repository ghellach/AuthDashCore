const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        mongoose.connect(
            process.env.MONGODB, 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true
            },
            () => console.log(Date() + " | Connected to MongoDB successfully")
        );
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = dbConnection;