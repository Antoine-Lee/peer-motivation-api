const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    email: 
    {
        type: String, 
        unique: true, 
        required: true
    }, 
    username: 
    {
        type: String, 
        unique: true, 
        required: true
    }, 
    password: 
    {
        type: String, 
        required: true
    }, 
    friends: 
    [{
        friend: {
            type: Types.ObjectId, 
            ref: "user"
        },
        isRequestor: {
            type: Boolean
        },
        isApproved: {
            type: Boolean
        }
    }]
})

// schema.virtual ("tasks", {
//     localField: "_id", 
//     foreignField: "owner", 
//     ref: "task", 
//     justOne: false 
// })

// schema.virtual ("helperTasks", {
//     localField: "_id", 
//     foreignField: "helper", 
//     ref: "task", 
//     justOne: false 
// })

module.exports = model ("user", schema); 