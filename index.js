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

app.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.query; 

        const userId = mongoose.Types.ObjectId(id);

        const updateUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updateUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updateUser
        });
    } catch (e) {
        res.status(400).json({
            message: "Error while updating user",
            error: e.message
        });
    }
});

app.delete('/delete-user', async (req, res) => {
    try {
        const { id } = req.query;

        // Validate the id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing ObjectId" });
        }

        const userId = mongoose.Types.ObjectId(id);

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (e) {
        res.status(500).json({
            message: "Error while deleting user",
            error: e.message
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})