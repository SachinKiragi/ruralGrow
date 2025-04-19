const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
});

const UserModel = mongoose.model("users", userSchema);


// With this:
module.exports = UserModel;

