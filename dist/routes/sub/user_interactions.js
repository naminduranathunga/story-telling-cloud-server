"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const record_interactions_1 = require("../../controllers/interactions/record_interactions");
const interactions_router = (0, express_1.Router)();
/**
 * User routes for recording user interactions
 *  - /api/user/int/record
 */
interactions_router.post('/record', record_interactions_1.record_user_interactions);
exports.default = interactions_router;
/*
curl http://localhost:3300/api/user/ints/record -X POST

*/ 
