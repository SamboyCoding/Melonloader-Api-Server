import {Request, Router} from 'express';
import apiV1GameRouter from './game';
import apiV1UserRouter from './user';
import bodyParser from 'body-parser';
import Session from '../../../entity/Session';
import apiV1AnalyticsRouter from './analytics';

const apiV1Router = Router();

apiV1Router.use(bodyParser.json());

apiV1Router.use(async (req: Request, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");

    const sessId = req.header('x-session-id');

    if(sessId) {
        req.session = await Session.findOneBy({sessionId: sessId});
    }

    next();
})

apiV1Router.get('/', (req, res) => {
    res.json({hello: 'World!'});
});

apiV1Router.use("/game/", apiV1GameRouter);
apiV1Router.use("/user/", apiV1UserRouter);
apiV1Router.use("/analytics/", apiV1AnalyticsRouter);

export default apiV1Router;
