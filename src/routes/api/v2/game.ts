import {NextFunction, Request, Response, Router} from "express";
import {Game} from "../../../entity/Game";
import V2GameSummary from "../../../nonDbModels/V2GameSummary";
import V2GameLaunchConfig from "../../../nonDbModels/V2GameLaunchConfig";

const apiV2GameRouter = Router();

apiV2GameRouter.get("/", async (req, res) => {
    //Return a list of game summaries
    const games = await Game.find();

    const summaries = games.map(V2GameSummary.from);

    res.json(summaries);
});

async function gameBySlugMiddleware(req: Request, res: Response, next: NextFunction) {
    //Get the game by slug
    const game = await Game.findOneBy({gameSlug: req.params.slug});

    if (!game) {
        res.status(404).json({
            error: "Game not found"
        });
        return;
    }

    req.game = game;
    next();
}

apiV2GameRouter.route("/:slug")
    .all(gameBySlugMiddleware)
    .get(async (req, res) => {
        //Return the game
        res.json(V2GameSummary.from(req.game));
    });

apiV2GameRouter.route("/:slug/launchConfig/:mlversion")
    .all(gameBySlugMiddleware)
    .get(async (req, res) => {
        //Return the launch config
        const launchConfig = V2GameLaunchConfig.build(req.game, req.params.mlversion);

        if(!launchConfig)
            return res.status(400).json({error: "No suitable launch config found"});

        res.json(launchConfig);
    });

export default apiV2GameRouter;