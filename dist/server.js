"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const api_routes_1 = __importDefault(require("./routes/api_routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3300;
app.use((0, cors_1.default)());
// Top level middlewares
app.use(body_parser_1.default.json());
//app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// sever on
app.get('/', (req, res) => {
    res.send('Server is running');
});
// register routes
app.use('/api', api_routes_1.default);
// start the server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
    // log all routes list
});
