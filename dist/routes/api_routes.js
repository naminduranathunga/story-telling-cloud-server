"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../controllers/users/authenticate");
const auth_user_1 = require("../middleware/auth_user");
const article_routes_1 = __importDefault(require("./sub/article_routes"));
const profile_routes_1 = __importDefault(require("./sub/profile_routes"));
const router = (0, express_1.Router)();
/**
 * User routs for authentication
 *  - /api/user/register
 *  - /api/user/login
 *  - /api/user/logout
 * */
const userRoutes = (0, express_1.Router)();
userRoutes.post('/login', authenticate_1.login_user);
userRoutes.post('/register', authenticate_1.register_user);
const protected_routes = (0, express_1.Router)();
protected_routes.use(auth_user_1.auth_user);
protected_routes.use('/articles', article_routes_1.default);
protected_routes.use('/stories', article_routes_1.default);
protected_routes.use('/profiles', profile_routes_1.default);
router.use('/user', userRoutes);
router.use('/', protected_routes);
exports.default = router;
