const express = require('express');
const Company = require('../modal/company');
const router = express.Router();
const nanoid = require('nanoid').nanoid;
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:"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"
    }
}));

router.post("/registration",async(req,res)=>{
    try{
        let errors = [];
        if(!validator.isEmail(req.body.email)){
            errors.push({message:"Email is not valid"});
        }
        if(validator.isEmpty(req.body.password) || !validator.isLength(req.body.password,{min:5})){
            errors.push({message:"Password is not valid"});
        }
        if(errors.length>0){
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error
        }
    const user = await company.find({companyName:req.body.companyName});
    console.log(user);
    if(user.length>0){
        return res.status(403).json({error:"Company Already Exists !!!"})
    }
    const password = await nanoid();
    const hashPassword = await bcrypt.hash(password,12);
    const company = new Company({
        email:req.body.email,
        password:hashPassword,
        jobPosted:[],
        companyName:req.body.companyName,
        phone:req.body.phone,
        noOfEmployees:req.body.noOfEmployees,
        locations:req.body.locations,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        companyLogo:'',
        description:'',
        companyQuotes:'',
        companyKeyWords:[],
        workingAtCompany:'',
        topEmployees:[],
        videos:[],
        images:[]
    })
    const result = await company.save();
    const token = jwt.sign({userId:result._id,email:result.email},"somesupersecretkey");
    transporter.sendMail({
        to:req.body.email,
        from:"jalajkalra4@gmail.com",
        subject:"Test",
        html:`
            <h1>HR Portal</h1>
            <p>You Have Successfully Registered.Please Update Your Profile in Your Dashboard</p>
            <p>Dashboard Link: <a href="https://localhost:3000/Dashboard/${req.body.companyName}">Click Here</a></p>
            <p>Login Email: ${req.body.email}</p>
            <p>Password: ${password} (Please change your password in dashboard)</p>
            <h3>Thank You For Registering in our Company</h3>    `
    })
    res.status(200).json({token,userId:result,message:'success'});
    }catch(err){
        res.sendStatus(404).json({message:'fail'});
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user  = await Company.findOne({email:req.body.email});
        console.log(user);
        if(!user){
            return res.json({error:'Wrong Credentials!!!'});
        }
        const isEqual = await bcrypt.compare(req.body.password,user.password);
        if(!isEqual){
            return res.status(403).json({error:'Wrong Credentials!!!'});
        }
        const token = jwt.sign({userId:user.id,email:user.email},"somesupersecretkey")
        res.status(200).json({token,user,message:'success'});
    }catch(e){
        res.sendStatus(404).json({message:'fail'});
    }
})

router.post("/updateProfile",async(req,res)=>{
    try{
        let errors = [];
        if(!validator.isEmail(req.body.email)){
            errors.push({message:"Email is not valid"});
        }
        if(validator.isEmpty(req.body.password) || !validator.isLength(req.body.password,{min:5})){
            errors.push({message:"Password is not valid"});
        }
        if(errors.length>0){
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            throw error
        }
        const company = {
            email:req.body.email,
            password:req.body.password,
            jobPosted:req.body.jobPosted,
            companyName:req.body.companyName,
            phone:req.body.phone,
            noOfEmployees:req.body.noOfEmployees,
            locations:req.body.locations,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            companyLogo:req.body.companyLogo,
            description:req.body.description,
            companyQuotes:req.body.companyQuotes,
            companyKeyWords:req.body.companyKeyWords,
            workingAtCompany:req.body.workingAtCompany,
            topEmployees:req.body.topEmployees,
            videos:req.body.videos,
            images:req.body.images
        }
    const user = await company.updateOne({companyName:req.body.companyName},company);
    console.log(user);
    transporter.sendMail({
        to:req.body.email,
        from:"jalajkalra4@gmail.com",
        subject:"Test",
        html:`
            <h1>HR Portal</h1>
            <p>You Have Successfully Updated Your Profile</p>  `
    })
    res.status(200).json({message:'success'});
    }catch(err){
        res.sendStatus(404).json({message:'fail'});
    }
})

router.post('/',async(req,res)=>{
    const user = await Company.findOne({_id:req.body.userId});
    if(user){
        res.json({user});
    }else{
        res.json({message:"fail"})
    }
     

})

router.post('/postAd',async(req,res)=>{
    const user = await Company.updateOne({_id:req.body.userId},{$set:{$push:{jobPosted:req.body.jobData}}});
    if(user){
        res.json({user});
    }else{
        res.json({message:"fail"})
    }
     

})

module.exports=router;