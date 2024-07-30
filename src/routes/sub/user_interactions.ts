
import { Router } from 'express';
import { record_user_interactions } from '../../controllers/interactions/record_interactions';


const interactions_router = Router();

/**
 * User routes for recording user interactions
 *  - /api/user/int/record
 */ 
interactions_router.post('/record', record_user_interactions);

export default interactions_router;

/*
curl http://localhost:3300/api/user/ints/record -X POST 

*/