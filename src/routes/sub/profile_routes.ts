import { Router } from "express";
import { get_user_profile } from "../../controllers/users/get_user_profile";


const profile_routes = Router();

profile_routes.post('/get-profile', get_user_profile);


export default profile_routes;