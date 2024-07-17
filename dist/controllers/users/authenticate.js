"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_user = exports.login_user = void 0;
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Handles the user login
 * @param req
 * @param res
 */
function login_user(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }
            (0, connect_mongodb_1.default)();
            const user = yield UserModel_1.default.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    message: "Email or password is incorrect"
                });
            }
            const user2 = user;
            // check if the password is correct
            console.log(user2, password);
            const is_valid = (0, bcrypt_1.compare)(password, user2.password);
            if (!is_valid) {
                return res.status(400).json({
                    message: "Email or password is incorrect"
                });
            }
            const jwt_secret = process.env.JWT_SECRET || "jwt_secret";
            // prepare the jwt token
            const token = {
                _id: user2._id,
                email: user2.email,
                name: user2.name
            };
            // jwt
            const jwt_token = jsonwebtoken_1.default.sign(token, jwt_secret, { expiresIn: '48h' });
            res.json({
                message: "User logged in successfully",
                token: jwt_token
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.login_user = login_user;
/**
 * Create a new user
 * @param req
 * @param res
 */
function register_user(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email and password are required"
                });
            }
            (0, connect_mongodb_1.default)();
            // check for existing user with the email
            const ex_user = yield UserModel_1.default.findOne({ email });
            if (ex_user) {
                return res.status(400).json({
                    message: "User with the email already exists"
                });
            }
            // hash the password
            const hashed_password = yield (0, bcrypt_1.hash)(password, 10);
            // create a new user
            const new_user = new UserModel_1.default({
                name,
                email,
                password: hashed_password,
            });
            yield new_user.save();
            res.json({
                message: "User registered successfully"
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    });
}
exports.register_user = register_user;
