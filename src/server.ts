import {config} from 'dotenv';
config();

import express from 'express';
import router from './routes/api_routes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3300;

app.use(cors());
// Top level middlewares
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// sever on
app.get('/', (req, res) => {
    res.send('Server is running');
});

// register routes
app.use('/api', router);



// start the server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});