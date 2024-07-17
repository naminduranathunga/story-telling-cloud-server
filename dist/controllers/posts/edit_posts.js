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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_article = void 0;
const auth_user_1 = require("../../middleware/auth_user");
function create_article(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (0, auth_user_1.get_current_user)();
            const article = req.body;
        }
        catch (error) {
        }
    });
}
exports.create_article = create_article;
