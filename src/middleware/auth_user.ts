import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserInterface } from "../interfaces/user_interface";

var __current_user: UserInterface | null = null;

/**
 * Authorize user with jwt token
 * Header
 *      Authorization: Bearer <jwt_token>
 * @param req
 * @param res
 * @param next
 */
export async function auth_user(req: Request, res: Response, next: NextFunction) {
    try {
        const auth_header = req.headers['authorization'];
        const token = auth_header?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized 0"
            });
        }

        const jwt_secret = process.env.JWT_SECRET || "jwt_secret";

        // verify the token
        try {
            const decoded = jwt.verify(token, jwt_secret) as UserInterface;
            set_current_user(decoded);
        } catch (error) {
            //console.log(error);
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            code: 100101101 // middleware auth_user error_number
        });
    }

    next();
}


/**
 * Get the current user
 * @returns 
 */

export function get_current_user(): UserInterface | null {
    return __current_user;
}

/**
 * Set the current user
 */
export function set_current_user(user: UserInterface) {
    __current_user = user;
}