const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send('Hello World this is my Home Page')
})


router.post('/register', async (req, res) => {
    const { name, email, phone, password, cpassword } = req.body;

    if( !name || !email || !phone || !password || !cpassword ) {
        return res.status(422).json({ error: "Please fill the field properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {

            return res.status(422).json({ error: "Email already exist" });
        }

        const user = new User({ name, email, phone, password, cpassword });

        await user.save();

        res.status(201).json({ message: "User Registered Successfully"})


        
    } catch (error) {
        
        console.log(error);
    }
})



router.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({ error: "Please filled the value" });
        }

        const userLogin = await User.findOne({ email: email});

        //console.log(userLogin);


        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 258926000000),
                httpOnly: true
            });

        if (!isMatch) {

            return res.status(400).json({ message: "Invalid Credential" });

        } else {

            return res.status(200).json({ message: "Signin Successfully" });

        }

        } else {

            return res.status(400).json({ message: "Invalid Credential" });

        }


        

        
    } catch (error) {
        
    }
})



module.exports = router;