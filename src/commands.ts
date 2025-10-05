import { authOauth } from "./auth.js";
import { config } from "./config.js";
import { processGuildData } from "./process.js";
import { ProcessPlayerDeaths, WCLBearer } from "./types";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerGuild(cmdName: string, ...args: string[]) {
    if (args.length !== 1) throw new Error(`usage: ${cmdName} <guildID>\nYou can get this information from warcraftlogs.com`);
    const guildId: number = parseInt(args[0]);
    try {
        const auth: WCLBearer = await authOauth(config);
        console.log(JSON.stringify(auth, null, 2));
        const accumulated: ProcessPlayerDeaths = await processGuildData(auth, guildId);
        for (const name in accumulated) {
            const stats = accumulated[name];
            stats.percent = parseFloat((stats.fights > 0 ? stats.deaths / stats.fights : 0).toFixed(2));
        }
        console.log(customJsonFormat(accumulated));
        process.exit(0);
    } catch (e: any) {
        console.log(e.message || String(e));
        process.exit(1);
    }
}

export async function handlerCharacter

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    if (registry[cmdName]) throw new Error(`command already registered: ${cmdName}`);
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) throw new Error(`unknown command: ${cmdName}`);
    await handler(cmdName, ...args);
}

function customJsonFormat(accumulated: ProcessPlayerDeaths) {
    const parts: string[] = []
    const playerNames = Object.keys(accumulated);
    playerNames.sort();
    playerNames.forEach(name => {
        let innerString = JSON.stringify(accumulated[name]);
        innerString = innerString.replace(/:/g, ": ").replace(/,/g, ", ");
        parts.push(`"${name}": ${innerString}`);
    });
    return `${parts.join(',\n')}`;
}