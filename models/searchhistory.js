const mongoose = require('mongoose')
const Schema =  mongoose.Schema
//model for storing the search history
const searchhistorySchema = new Schema({
    username:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    },
    queryTerm:{
        type:String,
        required:true
    }
},{timestamps:true})

const Searchhistory = mongoose.model('Searchhistory',searchhistorySchema)
module.exports = Searchhistory

