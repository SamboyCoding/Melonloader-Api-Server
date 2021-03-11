import {Router} from 'express';
import MelonApi from '../../../index';
import _ from "underscore";

const apiV1AnalyticsRouter = Router();

apiV1AnalyticsRouter.use((req, res, next) => {
    if(req.method == "OPTIONS")
        return next();

    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to access analytics data."});

    next();
})

apiV1AnalyticsRouter.get("/last-5-minutes/games", async (req, res) => {
    const data = MelonApi.analyticsEvents;

    const games = data.map(d => d.game);

    return res.json(_.countBy(games, g => g));
});

apiV1AnalyticsRouter.get("/last-5-minutes/success", async (req, res) => {
    const data = MelonApi.analyticsEvents;

    const processed = data.map(d => d.processed);

    return res.json(_.countBy(processed, p => p ? 'success': 'failure'));
})

export default apiV1AnalyticsRouter;
