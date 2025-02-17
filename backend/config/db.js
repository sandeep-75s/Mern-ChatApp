const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected${conn.connection.host}` .cyan.underline);
    } catch (error) {
        console.log(error)
        console.error("Error during connecting mongodb" .red.bold);
        process.exit();
    }
}

module.exports = connectDB;