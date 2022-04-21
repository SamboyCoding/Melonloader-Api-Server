import {Router} from "express";
import bodyParser from "body-parser";

const apiV2Router = Router();

apiV2Router.use(bodyParser.json());



export default apiV2Router;