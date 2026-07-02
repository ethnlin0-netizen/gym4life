import bcrypt from 'bcrypt' //for password hashing
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
//import crypto from 'crypto' //for generating password reset tokens later

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, login, password } = req.body; //pulls user's info out of req.body
        //check if user exists in the database using login (email for final version)
        const userExists = await User.findOne({ login });
        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
            //return makes it exit early so it does not continue the registration
        }

        //hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        //create and save new user to MongoDB
        const newUser = await User.create({
            //when the key and variable name are the same you don't have to write it out like firstName: firstName
            firstName,
            lastName,
            email,
            login,
            password: hashedPassword
        });

        //generate a jwt with the new user's id
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        //sends token back to frontend
        res.status(201).json({ token, user: { id: newUser._id, login: newUser.login }});
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { login, password } = req.body;
        //check if username and password are correct
        const user = await User.findOne({ login });
        if(!user) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Incorrect username or password"});
        }

        //they match, so generate a jwt and send it back
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token, user: { id: user._id, login: user.login }})
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export default { register, login }
