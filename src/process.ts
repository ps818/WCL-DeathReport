import { config, DEBUG } from "./config.js";
import { getCharacterDeaths, getDeaths } from "./deaths.js";
import { getCharacterFights, getFights } from "./fights.js";
import { getCharacterPlayers, getPlayers } from "./players.js";
import { Character, CharacterFightReport, deathEntry, FightReport, PlayerDetails, ProcessPlayerDeaths, WCLBearer } from "./types";

export async function processGuildData(auth: WCLBearer, guildId: number, page: number = 1, accumulated: ProcessPlayerDeaths = {}): Promise<ProcessPlayerDeaths> {
    debugLog(`Calling getFights(page=${page})`);
    const fights: FightReport = await getFights(auth, page, guildId);
    debugLog(`Received ${fights.data[0].fights.length ?? 0} fights on page ${page}`);
    if ((!fights.data || fights.data[0].fights.length === 0) && fights.has_more_pages) return processGuildData(auth, guildId, page + 1, accumulated);
    else if ((!fights.data || fights.data[0].fights.length === 0) && !fights.has_more_pages) return accumulated;
    const deaths: deathEntry[] = await getDeaths(auth, page, guildId);
    const players: PlayerDetails[] = await getPlayers(auth, page, guildId);

    const playerMap = new Map<number, string>();
    for (const p of players) {
        playerMap.set(p.id, p.name);
        if (!accumulated[p.name]) {
            accumulated[p.name] = { deaths: 0, fights: 0, percent: 0};
        }
    }

    for (const fight of fights.data[0].fights) {
        for (const pid of fight.friendlyPlayers) {
            const name = playerMap.get(pid);
            if (!name) continue;
            accumulated[name].fights++;
        }
    }

    for (const death of deaths) {
        if (accumulated[death.name]) accumulated[death.name].deaths++;
    }

    debugLog(`Accumulated so far: ${Object.keys(accumulated).length} players`);

    if (fights.has_more_pages) return processGuildData(auth, guildId, page + 1, accumulated);

    return accumulated;
}

export async function processCharacterData(auth: WCLBearer, character: Character, page: number = 1, accumulated: ProcessPlayerDeaths = {}): Promise<ProcessPlayerDeaths> {
    debugLog(`Calling getCharacterFights(page=${page})`);
    const fights: CharacterFightReport = await getCharacterFights(auth, page, character);
    debugLog(`Received ${fights.data[0].fights.length ?? 0} fights on page ${page}`);
    if ((!fights.data || fights.data[0].fights.length === 0) 
        && fights.has_more_pages &&
        (fights.data[0].zone.id === config.zoneId || fights.data[0].zone.difficulties[0].id === 10)) {
            return processCharacterData(auth, character, page + 1, accumulated);
        }
    else if (fights.data[0].zone.id !== config.zoneId || ((!fights.data || fights.data[0].fights.length === 0) && !fights.has_more_pages)) return accumulated;
    const deaths: deathEntry[] = await getCharacterDeaths(auth, page, character);
    debugLog(`Received ${deaths.length ?? 0} deaths on page ${page}`);
    const players: PlayerDetails[] = await getCharacterPlayers(auth, page, character);
    debugLog(`Received ${players.length ?? 0} players on page ${page}`);

    if (!accumulated[character.name]) accumulated[character.name] = { deaths: 0, fights: 0, percent: 0 };

    const playerMap = new Map<number, string>();
    for (const p of players) {
        playerMap.set(p.id, p.name);
    }

    for (const fight of fights.data[0].fights) {
        for (const pid of fight.friendlyPlayers) {
            const name = playerMap.get(pid);
            if (!name || name !== character.name) continue;
            accumulated[name].fights++;
        }
    }

    for (const death of deaths) {
        if (accumulated[death.name]) accumulated[death.name].deaths++;
    }

    if (fights.has_more_pages) return processCharacterData(auth, character, page + 1, accumulated);

    return accumulated;
}

function debugLog(message: string) {
    if (DEBUG) console.log(message);
}