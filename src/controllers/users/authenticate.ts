import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import ConnectMongoDB from "../../lib/connect_mongodb";
import { hash, compare } from "bcrypt";
import { UserInterface } from "../../interfaces/user_interface";
import { HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
/** 
 * Handles the user login
 * @param req 
 * @param res 
 */
export function login_user(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        ConnectMongoDB();

        const user = UserModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }
        const user2: UserInterface = user as unknown as UserInterface; 

        // check if the password is correct
        const is_valid = compare(password, user2.password);
        if (!is_valid) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }

        const jwt_secret = process.env.JWT_SECRET||"jwt_secret";

        // prepare the jwt token
        const token = {
            user_id: user2._id,
            email: user2.email,
            name: user2.name
        }

        // jwt
        const jwt_token = jwt.sign(token, jwt_secret, { expiresIn: '48h'});
        
        res.json({
            message: "User logged in successfully",
            token: jwt_token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

/**
 * Create a new user
 * @param req 
 * @param res 
 */
export async function register_user(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        ConnectMongoDB();
        
        // check for existing user with the email
        const ex_user = await UserModel.findOne({email});
        if (ex_user) {
            return res.status(400).json({
                message: "User with the email already exists"
            });
        }

        // hash the password
        const hashed_password = await hash(password, 10);

        // create a new user
        const new_user = new UserModel({
            name,
            email,
            password: hashed_password,
        })
        await new_user.save();

        res.json({
            message: "User registered successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}