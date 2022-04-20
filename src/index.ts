import 'reflect-metadata';
import {DataSource} from 'typeorm';
import express, {Application, static as eStatic} from 'express';
import apiV1Router from './routes/api/v1';
import {config} from 'dotenv';
import AnalyticsEvent from './nonDbModels/AnalyticsEvent';
import moment = require('moment');
import CloudflareHandler from "./CloudflareHandler";
import {Game} from "./entity/Game";
import Session from "./entity/Session";
import User from "./entity/User";
import RuntimeConfiguration from "./entity/RuntimeConfiguration";
import Tool from "./entity/Tool";
import ToolVersion from "./entity/ToolVersion";

export default class MelonApi {
    public static orm: DataSource;
    public static expressServer: Application;
    public static cloudflare: CloudflareHandler;
    public static analyticsEvents: AnalyticsEvent[] = [];

    public static async init() {
        MelonApi.cloudflare = new CloudflareHandler();
        if(!(await MelonApi.cloudflare.Init())) {
            console.error("[Init] Failed to initialize Cloudflare handler. Aborting start.");
            return;
        }

        console.log('[ORM] Connecting...');
        MelonApi.orm = new DataSource({
            type: process.env.DB_TYPE as any,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: false,
            entities: [Game, Session, User, RuntimeConfiguration, Tool, ToolVersion],
            subscribers: [],
            migrations: [],
        })
        await MelonApi.orm.initialize();
        console.log('[ORM] Connected.');

        console.log('[ORM] Ensuring legacy tools are in the database...');
        await Tool.InitLegacyTools();
        console.log('[ORM] Done.');

        MelonApi.expressServer = express();

        MelonApi.expressServer.use("/api/v1/", apiV1Router);
        MelonApi.expressServer.use("/", eStatic("dist"))

        const port = Number(process.env.PORT || 7778);
        MelonApi.expressServer.listen(port, "0.0.0.0", () => {
            console.log(`[Express] Now listening on port ${port}`);
        });

        setInterval(MelonApi.CleanupAnalyticsEvents, 1000 * 60);

        console.log('[Init] Ready.');
    }

    public static CleanupAnalyticsEvents() {
        console.log("[Analytics] Cleaning up events not in the last 5 minutes...");

        const was = MelonApi.analyticsEvents.length;
        const lastAcceptableDate = moment().subtract(5, 'minutes');
        MelonApi.analyticsEvents = MelonApi.analyticsEvents.filter(e => e.when.isSameOrAfter(lastAcceptableDate));

        console.log(`[Analytics] Cleaned up from ${was} to ${MelonApi.analyticsEvents.length} entries`);
    }
}

config();

console.log(`[Init] Account creation key is ${process.env.ACCOUNT_CREATION_KEY}`);

MelonApi.init().catch(e => {
    console.error('[Init] Failed!', e);
});
