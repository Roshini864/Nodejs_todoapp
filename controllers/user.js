import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import { sendCookie } from "../utils/features.js"
import ErrorHandler from "../middlewares/error.js";


export const login = async (req, res) => {
    try {
        // console.log(req.body);
        const {email, password} = req.body;
        // console.log(email)
        const user = await User.findOne({email}).select("+password");
        // console.log(user);
        // if(!user) return res.status(404).json({
        //     success: false, 
        //     message: "Invalid Email or Password",
        // });
    
        if(!user) return next(new ErrorHandler("Invalid Email or Password", 400))
    
        const isMatch = await bcrypt.compare(password, user.password)
        // if(!isMatch) return res.status(404).json({
        //     success: false, 
        //     message: "Invalid Email or Password",
        // });
        if(!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404))
    
    
        sendCookie(user, res, `Welcome back, ${user.name}`, 200)
    
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let user = await User.findOne({email});
    
        // if(user) return res.status(404).json({
        //     success: false, 
        //     message: "User Already Exist"
        // });
        if(user) return next(new ErrorHandler("User Already Exists", 404))
    
        const hashPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            name,
            email,
            password: hashPassword,
        });
        sendCookie(user, res, "Registered Successfully", 201);
    } catch (error) {
        next(error)
    }
}

export const getMyProfile =  (req, res) => {
            res.status(200).json({
                success: true,
                user: req.user,
            });
}

// export const getMyProfile = async (req, res) => {
//     try{
//         res.status(200).json({
//             success: true,
//             user: user,
//         });
//     }catch (err) {
//         // console.log(`Error: ${err.message}`);
//         res.status(500).json({
//           message: "Error",
//           success: false,
//           error: err.message,
//         });
//       }
// }

// let decoded;
// try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
// } catch (err) {
//     return res.status(401).json({
//     success: false,
//     message: "Invalid token",
// });
// }

export const logout = (req, res) => {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Developmet"? "lax": "none",
            secure: process.env.NODE_ENV === "Developmet"? false: true
        }).json({
            success: true,
            user: req.user,
        })
}