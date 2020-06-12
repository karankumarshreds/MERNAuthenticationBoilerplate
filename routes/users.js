const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
//to validate incoming data
const { check, validationResult } = require('express-validator');
const passwordResetEmail = require('./email');


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
            // return res.send('Already exists')
            return res.status(401).json({err: "Account with email already exists"});
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
        res.status(200).json({token: token, user: user});
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
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.json(false);
        //also check for user
        const user = await User.findById(decoded.id).select('-password');
        if(!user) return res.json(false);
        //if valid, return the user data
        return res.json(user); 
    } catch (error) {
        res.json(false);
    }
});

//for password reset email request
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({err: "Invalid email address"});
        } 
        const token = jwt.sign(
            { id : user._id },
            process.env.JWT_SECRET_RESET,
            { expiresIn : '10m' }
        );
        await user.updateOne({resetToken : token});
        passwordResetEmail(email, token);
        return res.status(200).json({response: "Password reset email sent"});
    } catch (error) {
        return res.status(500).json({err: "Internal server error"});
    };
});

//after user resets and submits the new password
router.post("/reset-password/:token", async (req, res) => {
    const token = req.params.token;
    const {password} = req.body;
    if (!token || !password) {
        return res.status(400).json({err: "Invalid request"});
    };
    try {
        jwt.verify(token, process.env.JWT_SECRET_RESET, function(jwtError, decodedData) {
            if (jwtError) {
                return res.status(400).json({err: "Token expired"})
            }
        });
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            return res.status(400).json({err: "User not found"});
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
        try {
            
            const passwordResetDone = await User.findByIdAndUpdate(user._id, {password: hashedPassword});
            if (passwordResetDone) {
                return res.status(200).json({response: "Password reset done"});
            }
        } catch (errorUpdatingPass) {
        }
    } catch (error) {
        res.status(500).json({err: "Internal server error"});
    }
});

module.exports = router;