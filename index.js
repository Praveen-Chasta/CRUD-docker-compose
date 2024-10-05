const express = require('express');
const mongoose = require('mongoose');
const { User } = require("./db/db")
const app = express();
const PORT = 3000;

app.use(express.json())

mongoose.connect("mongodb://mongodb:27017/user")
.then(() => {
    console.log("MongoDB is connected")
})
.catch((e) => {
    console.log("MongoDB is not connected", e.message)
})


app.get('/', async (req,res) => {
    try {
        const user = await User.find();
        res.status(201).json(user)
    }catch(e){
        res.status(400).json({
            message : "error",
            error : e.message
        })
    }
})

app.post('/create-user', async (req,res) => {
    
   try{
        const {username, password} = req.body;

        const newUser = await User.create({
            username,
            password
        })

        res.status(201).json({
            message : "user created successfully",
            user : newUser
        })        

   }catch(e){
    res.status(400).json({
        message : "Error While creating user",
        error: e.message
    })
   }

})


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})