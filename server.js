const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//mongoose connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("DB Connected");
    }
    catch(err) {
        console.log(err);
    }
}
connectDB();

//json body parser middleware
app.use(express.json());
app.use(cors());

//including routes
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    
});
 