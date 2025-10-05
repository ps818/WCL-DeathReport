import path from "path";
import type { WCLBearer, WCLConfig } from "./types";
import fs from "fs";

export async function authOauth(config: WCLConfig): Promise<WCLBearer> {
    const cached = loadToken();
    if (cached) return cached;
    const response = await fetch(`https://www.warcraftlogs.com/oauth/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    });
    const raw = await response.json();
    if (!isWCLBearer(raw)) {
        throw new Error("Invalid auth response");
    }
    saveToken(raw);
    return raw;
    //console.log(`Response: ${JSON.stringify(raw, null, 2)}`);
}

function saveToken(token: WCLBearer) {
    const expiresAt = Date.now() + (token.expires_in - 60) * 1000;
    const data: WCLBearer = { token_type: token.token_type, access_token: token.access_token, expires_in: expiresAt };
    fs.writeFileSync(path.join(process.cwd(), ".token.json"), JSON.stringify(data));
}

function loadToken(): WCLBearer | null {
    if (!fs.existsSync(path.join(process.cwd(), ".token.json"))) return null;
    try {
        const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".token.json"), "utf-8")) as WCLBearer;
        if (data.expires_in > Date.now()) return data;
    } catch {}
    return null;
}

async function logResponse(res: Response) {
    console.log(`status: ${res.status}`);
    console.log(`ok: ${res.ok}`);
    console.log(`headers: ${Object.fromEntries(res.headers)}`);
    try {
        console.log(`body: ${await res.json()}`);
    } catch {
        console.log(`body: ${await res.text()}`);
    }
}

function isWCLBearer(obj: any): obj is WCLBearer {
    return ( obj &&
        typeof obj.token_type === "string" &&
        typeof obj.expires_in === "number" &&
        typeof obj.access_token === "string"
    );
}