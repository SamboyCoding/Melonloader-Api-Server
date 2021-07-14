import {Router} from 'express';
import {Game} from '../../../entity/Game';
import MelonApi from '../../../index';
import AnalyticsEvent from '../../../nonDbModels/AnalyticsEvent';

const apiV1GameRouter = Router();

apiV1GameRouter.get('/', async (req, res) => {
    const games = await Game.find();
    res.json(games);
});

apiV1GameRouter.get('/:gameSlug', async (req, res) => {
    const game = await Game.findOne(req.params.gameSlug);

    if (!game) {
        MelonApi.analyticsEvents.push(new AnalyticsEvent(req.params.gameSlug, false));
        console.log(`[Game] Found no result for ${req.params.gameSlug}`);
        res.status(404).json({error: `No game found for the slug ${req.params.gameSlug}`});
        return;
    }

    if (!game.mappingFileSHA512) {
        await game.refreshHash();
        console.log(`[Game] Recalculated SHA512 for ${game.gameName}`);
    }

    MelonApi.analyticsEvents.push(new AnalyticsEvent(game.gameSlug, true));
    console.log(`[Game] Processed Request for ${game.gameSlug}`);
    res.json(game);
});

apiV1GameRouter.delete("/:gameSlug/mapSha512", async (req, res) => {
    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to purge SHA512 hashes."});

    const game = await Game.findOne(req.params.gameSlug);

    if(!game)
        return res.status(404).json({error: `No game found for game slug: ${req.params.gameSlug}`});

    console.log(`[Game] ${req.session.user.username} deleted the cached SHA512 mapping hash for ${game.gameName}`);
    game.mappingFileSHA512 = null;
    await game.save();

    await MelonApi.cloudflare.purgeCache();

    return res.status(204).send();
});

apiV1GameRouter.patch("/:gameSlug/mappingUrl", async (req, res) => {
    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to edit mapping URLs."});

    const game = await Game.findOne(req.params.gameSlug);

    if(!game)
        return res.status(404).json({error: `No game found for game slug: ${req.params.gameSlug}`});

    if(req.body.mappingUrl === undefined)
        return res.status(400).json({error: "Missing new mappingUrl"});

    const newUrl = req.body.mappingUrl;

    if(newUrl !== game.mappingUrl) {
        console.log(`[Game] ${req.session.user.username} updated the mapping url for ${game.gameName} from "${game.mappingUrl}" to "${newUrl}"`);

        game.mappingUrl = newUrl ? newUrl : null;
        await game.save();

        await MelonApi.cloudflare.purgeCache();
    }

    return res.status(204).send();
});

apiV1GameRouter.patch("/:gameSlug/obfuscationRegex", async (req, res) => {
    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to edit mapping URLs."});

    const game = await Game.findOne(req.params.gameSlug);

    if(!game)
        return res.status(404).json({error: `No game found for game slug: ${req.params.gameSlug}`});

    if(req.body.obfuscationRegex === undefined)
        return res.status(400).json({error: "Missing new obfuscationRegex"});

    const newRegex = req.body.obfuscationRegex;

    if(newRegex !== game.obfuscationRegex) {
        console.log(`[Game] ${req.session.user.username} updated the obfuscation regex for ${game.gameName} from "${game.obfuscationRegex}" to "${newRegex}"`);

        game.obfuscationRegex = newRegex ? newRegex : null;
        await game.save();

        await MelonApi.cloudflare.purgeCache();
    }

    return res.status(204).send();
});

apiV1GameRouter.patch("/:gameSlug/unhollowerVersion", async (req, res) => {
    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to edit unhollower versions."});

    const game = await Game.findOne(req.params.gameSlug);

    if(!game)
        return res.status(404).json({error: `No game found for game slug: ${req.params.gameSlug}`});

    if(req.body.unhollowerVersion === undefined)
        return res.status(400).json({error: "Missing new unhollowerVersion"});

    const newVersion = req.body.unhollowerVersion;

    if(newVersion !== game.forceUnhollowerVersion) {
        console.log(`[Game] ${req.session.user.username} updated the unhollower version for ${game.gameName} from "${game.forceUnhollowerVersion}" to "${newVersion}"`);

        game.forceUnhollowerVersion = newVersion ? newVersion : null;
        await game.save();

        await MelonApi.cloudflare.purgeCache();
    }

    return res.status(204).send();
});

apiV1GameRouter.patch("/:gameSlug/dumperVersion", async (req, res) => {
    if(!req.session || !req.session.user)
        return res.status(401).json({error: "X-SESSION-ID header is missing or invalid"});

    if(req.session.user.privilegeLevel === 'editor')
        return res.status(403).json({error: "You do not have permission to edit dumper versions."});

    const game = await Game.findOne(req.params.gameSlug);

    if(!game)
        return res.status(404).json({error: `No game found for game slug: ${req.params.gameSlug}`});

    if(req.body.dumperVersion === undefined)
        return res.status(400).json({error: "Missing new dumperVersion"});

    const newVersion = req.body.dumperVersion;

    if(newVersion !== game.forceCpp2IlVersion) {
        console.log(`[Game] ${req.session.user.username} updated the dumper version for ${game.gameName} from "${game.forceCpp2IlVersion}" to "${newVersion}"`);

        game.forceCpp2IlVersion = newVersion ? newVersion : null;
        await game.save();

        await MelonApi.cloudflare.purgeCache();
    }

    return res.status(204).send();
});


export default apiV1GameRouter;
