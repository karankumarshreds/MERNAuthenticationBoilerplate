const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
//to validate incoming data
const { check, validationResult } = require('express-validator');


router.post("/signup", [
    check('email', 'Email is not valid').isEmail(),
    check('password' ).isLength({min:6})
    ], async (req, res) => {
    const { email, password, name } = req.body;
    //check if request is empty
    if( !email || !password ){
        return res.status(400).json({ err: "Email and Password are required" });
    };
    //check if request is valid
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({err: "Invalid email or password too short"});
    };
    try {
        //check if email already exists
        const existingUser = await User.findOne({ email : email });
        if (existingUser) {
            return res.status(400).json({err: "Account with email already exists"});
        };
        const hashGen = async () => {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, hash) => {
                    if(!err) {
                        return resolve(hash);
                    };
                });
            });
            return hashedPassword;
        }
        const hashedPassword = await hashGen();
        newUser = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({err: "Internal server error"});
    };
})

router.post("/login", [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty()
    ], async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if ( !errors.isEmpty() || !email || !password ) {
        return res.status(401).json({err: "Authentication failure"});
    };
    try {
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(401).json({err: "Invalid username or password"});
        };
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({err: "Invalid username or password"});
        };
        //if valid password 
        const token = jwt.sign(
            { id : user._id },
            process.env.JWT_SECRET,
            { expiresIn : '1h' }
        );
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({err: "Internal server error"});
    };
});

router.delete("/delete", auth, async (req, res) => {
    const id = req.userID;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if(deleteUser === null){
            return res.status(500).json({err: "Invalid request"});
        };
        res.status(201).json({response: "Account deleted"});    
    } catch (error) {
        res.status(500).json({err: "Invalid request"});
    }
});

//for frontend validation
router.post("/token", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        //if present
        console.log("BOOBIES");
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log('again stuck')
        if(!decoded) return res.json(false);
        //also check for user
        const user = await User.findById(decoded.id);
        if(!user) return res.json(false);
        //if valid
        return res.json(true);
    } catch (error) {
        res.json(false);
    }
})

module.exports = router;