const mongoose = require('mongoose');


const userSchema = mongoose.Schema(
    {
        name: String,
        username: String,
        email: String,
        password: String,
        cnfmpassword: String
    }
);

const User = mongoose.model("User", userSchema);


module.exports = User