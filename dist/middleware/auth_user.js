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
exports.set_current_user = exports.get_current_user = exports.auth_user = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var __current_user = null;
/**
 * Authorize user with jwt token
 * Header
 *      Authorization: Bearer <jwt_token>
 * @param req
 * @param res
 * @param next
 */
function auth_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_header = req.headers['authorization'];
            const token = auth_header === null || auth_header === void 0 ? void 0 : auth_header.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    message: "Unauthorized 0"
                });
            }
            const jwt_secret = process.env.JWT_SECRET || "jwt_secret";
            // verify the token
            try {
                const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
                set_current_user(decoded);
            }
            catch (error) {
                //console.log(error);
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                code: 100101101 // middleware auth_user error_number
            });
        }
        next();
    });
}
exports.auth_user = auth_user;
/**
 * Get the current user
 * @returns
 */
function get_current_user() {
    return __current_user;
}
exports.get_current_user = get_current_user;
/**
 * Set the current user
 */
function set_current_user(user) {
    __current_user = user;
}
exports.set_current_user = set_current_user;
