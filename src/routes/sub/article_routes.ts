import { Router } from 'express';
import { create_article, delete_article } from '../../controllers/posts/edit_articles';
import { get_suggested_articles, get_article, get_article_body } from '../../controllers/posts/retrive_articles';
import { add_comment_to_story, add_like_to_story, get_comments_of_the_story, remove_comment_from_story } from '../../controllers/posts/story_user_interactions';

const article_routes = Router();
article_routes.post('/create', create_article);
article_routes.post('/delete', delete_article);
article_routes.post('/get-suggested', get_suggested_articles);
article_routes.post('/get-single', get_article);

article_routes.post('/get-body', get_article_body);
article_routes.post('/add-delete-like', add_like_to_story);

article_routes.post('/get-comments', get_comments_of_the_story);
article_routes.post('/add-comment', add_comment_to_story);
article_routes.post('/delete-comment', remove_comment_from_story);


export default article_routes;