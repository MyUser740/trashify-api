import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import morgan from 'morgan';

import AccountController from './apis/account.controller';
import ArticlesController from './apis/articles.controller';
import ChatController from './apis/chat.controller';
import PlaceController from './apis/place.controller';
import ProductController from './apis/products.controller';
import path from 'path';

console.log(process.env.NODE_ENV === 'production' ? process.env.DB_PATH : path.join(__dirname, '../data/db.sqlite'));

const app = express();

const server = http.createServer(app);

app.use(morgan('combined'))
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/account', AccountController);
app.use('/api/articles', ArticlesController);
app.use('/api/chat', ChatController);
app.use('/api/place', PlaceController);
app.use('/api/product', ProductController);

server.listen(3000, () => {
    console.log('Server running on port 3000');
});