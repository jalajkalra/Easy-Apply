const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    jobPosted:{
        type:Array
    },
    companyName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    noOfEmployees:{
        type:String,
        required:true
    },
    locations:{
        type:Array,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    companyLogo:{
        type:String
    },
    description:{
        type:String
    },
    companyQuotes:{
        type:String
    },
    companyKeyWords:{
        type:Array,
        default:[]
    },
    workingAtCompany:{
        type:string
    },
    topEmployees:{
        type:Array
    },
    videos:{
        type:Array
    },
    images:{
        type:Array
    }
})

module.exports = mongoose.model("Company",CompanySchema);