const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic:{
        type:String,
        required:true,
        // default:`https://api.dicebear.com/5.x/initials/svg?seed=${this.name}`
        default: function () {
            return `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(this.name)}`;
        },
    },
},
{
    timestamps:true
}
);

UserSchema.pre("save", async function (next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});

const User = mongoose.model("User",UserSchema);
module.exports = User;