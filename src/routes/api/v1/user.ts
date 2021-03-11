import {Router} from 'express';
import User from '../../../entity/User';
import {compareSync, hashSync} from "bcryptjs";
import Session from '../../../entity/Session';

const apiV1UserRouter = Router();

apiV1UserRouter.post('/check-creds', async (req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).json({error: 'Credentials not specified'});

    const user = await User.findOne({where: {username: req.body.username}})

    if(!user)
        return res.status(403).json({error: "These credentials do not match our records"});

    if(!compareSync(req.body.password, user.hash))
        return res.status(403).json({error: "These credentials do not match our records"});

    const session = new Session();
    session.user = user;
    await session.save();

    return res.json({username: user.username, role: user.privilegeLevel, sessionId: session.sessionId});
});

apiV1UserRouter.post("/check-session", async (req, res) => {
    if(!req.body.sessionId)
        return res.status(400).json({error: "SessionId not specified"});

    const session = await Session.findOne(req.body.sessionId);

    if(!session)
        return res.status(401).json({error: "SessionId is invalid"});

    const user = session.user;

    return res.json({username: user.username, role: user.privilegeLevel, sessionId: session.sessionId});
})

apiV1UserRouter.post("/create-account", async (req, res) => {
    if(!req.body.ACC_CREATE_KEY || req.body.ACC_CREATE_KEY !== process.env.ACCOUNT_CREATION_KEY)
        return res.status(400).send("Cannot POST /api/v1/user/create-account");

    if(!req.body.username || !req.body.password || !req.body.level)
        return res.status(400).json({error: "Bad request"});

    const uname = req.body.username;
    const pwd = req.body.password;
    const level = req.body.level;

    if(level !== "admin" && level !== "moderator" && level !== "editor")
        return res.status(400).json({error: "Bad level"});

    const hash = hashSync(pwd, 8);

    const user = new User();
    user.username = uname;
    user.hash = hash;
    user.privilegeLevel = level;
    await user.save();

    res.json({id: user.id});
})

export default apiV1UserRouter;
