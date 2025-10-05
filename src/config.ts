import type { WCLConfig } from "./types";

process.loadEnvFile(".env");

export const config: WCLConfig = envOrThrow();
export const WCLUrl = "https://www.warcraftlogs.com/api/v2/client";
export const DEBUG = process.env.DEBUG;

export function envOrThrow(): WCLConfig {
    if (!process.env.CLIENT_SECRET ||
        !process.env.CLIENT_ID ||
        !process.env.GUILD_ID ||
        !process.env.ZONE_ID ||
        !process.env.DIFFICULTY ||
        !process.env.WIPE_CUT_OFF
    ) {
        throw new Error(".env file not setup properly. Check docs");
    }
    if (typeof process.env.CLIENT_SECRET !== "string" ||
        typeof process.env.CLIENT_ID !== "string" ||
        typeof parseInt(process.env.ZONE_ID) !== "number" ||
        typeof parseInt(process.env.DIFFICULTY) !== "number" ||
        typeof parseInt(process.env.WIPE_CUT_OFF) !== "number"
    ) {
        throw new Error(".env file has incorrect types. Check docs");
    }
    let cleanConfig: WCLConfig = {
        clientSecret: process.env.CLIENT_SECRET,
        clientId: process.env.CLIENT_ID,
        zoneId: Number(process.env.ZONE_ID),
        difficulty: Number(process.env.DIFFICULTY),
        wipeCutOff: Number(process.env.WIPE_CUT_OFF)
    };

    return cleanConfig;
}
