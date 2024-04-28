import { Router } from 'express';
import { create_article, delete_article } from '../../controllers/posts/edit_articles';
import { get_suggested_articles, get_article } from '../../controllers/posts/retrive_articles';

const article_routes = Router();
article_routes.post('/create', create_article);
article_routes.post('/delete', delete_article);
article_routes.post('/get-suggested', get_suggested_articles);
article_routes.post('/get-single', get_article);


export default article_routes;