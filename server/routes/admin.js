const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout = '../views/layouts/admin';
/**
 * GET/
 * Admin - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        res.render('admin/index', { locals, layout: adminLayout });
    }
    catch (error) {
        console.log(error);
    }

});


/**
 * POST/
 * Admin - Check Login
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Wrong username or password.');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Wrong username or password.');
        }

        // Generate a JWT token (optional, for session management)
        const token = jwt.sign({ id: user._id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'You are logged in.', token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * POST/
 * Admin - Register
 */
router.post('/register', async (req, res) => {
    try {
       const { username, password } = req.body;
       const hashedPassword = await bcrypt.hash(password, 10);

       try {
           const user = await User.create({ username, password: hashedPassword });
           res.status(201).json({message: 'User Created', user});
       } catch (error) {
           if(error.code === 11000) {
               res.status(409).json({ message: 'Username already exists' });
           }
           res.status(500).json({ message: 'Internal Server Error' });
       }
         

    }
    catch (error) {
        console.log(error);
    }
});


module.exports = router;
