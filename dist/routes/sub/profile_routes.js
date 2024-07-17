"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_user_profile_1 = require("../../controllers/users/get_user_profile");
const profile_routes = (0, express_1.Router)();
profile_routes.post('/get-profile', get_user_profile_1.get_user_profile);
exports.default = profile_routes;
