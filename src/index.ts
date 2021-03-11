import 'reflect-metadata';
import {Connection, createConnection} from 'typeorm';
import express, {Application, static as eStatic} from 'express';
import apiV1Router from './routes/api/v1';
import {config} from 'dotenv';
import AnalyticsEvent from './nonDbModels/AnalyticsEvent';
import moment = require('moment');

export default class MelonApi {
    public static orm: Connection;
    public static expressServer: Application;
    public static analyticsEvents: AnalyticsEvent[] = [];

    public static async init() {
        console.log('[ORM] Connecting...');
        MelonApi.orm = await createConnection();
        console.log('[ORM] Connected.');

        MelonApi.expressServer = express();

        MelonApi.expressServer.use("/api/v1/", apiV1Router);
        MelonApi.expressServer.use("/", eStatic("dist"))

        const port = Number(process.env.PORT || 7778);
        MelonApi.expressServer.listen(port, "0.0.0.0", () => {
            console.log(`[Express] Now listening on port ${port}`);
        });

        setInterval(MelonApi.CleanupAnalyticsEvents, 1000 * 60);
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

MelonApi.init().then(() => {
    console.log('[Init] Ready.');
}).catch(e => {
    console.error('[Init] Failed!', e);
});
