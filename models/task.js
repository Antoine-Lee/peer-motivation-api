const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    title: 
    {
        type: String, 
        required: true
    }, 
    description: 
    {
        type: String
    }, 
    dueDate: 
    {
        type: Date, 
        required: true
    }, 
    reward: 
    {
        type: String
        // required: true
    },
    consequence: 
    {
        type: String
        // required: true
    },
    owner: 
    {
        type: Types.ObjectId, 
        required: true,
        ref: "user"
    }, 
    helper: 
    {
        type: Types.ObjectId, 
        required: true, 
        ref: "user"
    }
})

module.exports = model ("task", schema); 