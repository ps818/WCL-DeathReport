import { config, WCLUrl } from "./config.js";
import { Character, CharacterData, PlayerData, PlayerDetails, PlayerReport, WCLBearer } from "./types";

export async function getPlayers(auth: WCLBearer, page: number, guildId: number): Promise<PlayerDetails[]> {
    const query = `
    {
        reportData {
            reports(guildID: ${guildId}, zoneID: ${config.zoneId}, limit: 1, page: ${page}) {
                has_more_pages
                last_page
                total
                data {
                    playerDetails(difficulty: ${config.difficulty}, startTime: 0, endTime: 9999999999, killType: Encounters)
			    }
		    }
	    }
    }`;

    const result = await fetch(WCLUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token_type} ${auth.access_token}`,
        },
        body: JSON.stringify({ query })
    });

    const json: PlayerData = await result.json();
    const report: PlayerReport = json.data.reportData.reports;

    // add dps
    let entry: PlayerDetails[] = [];
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.dps.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.dps[i])
    }
    // add heals
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.healers.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.healers[i])
    }
    // add tanks
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.tanks.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.tanks[i])
    }

    return entry;

}

export async function getCharacterPlayers(auth: WCLBearer, page: number, character: Character): Promise<PlayerDetails[]> {
    const query = `
    {
        characterData {
            character(name: ${character.name}, serverSlug: ${character.server}, serverRegion: ${character.region}) {
                name
                recentReports(limit: 1, page: ${page}) {
                    has_more_pages
                    last_page
                    total
                    data {
                        playerDetails(difficulty: ${config.difficulty}, startTime: 0, endTime: 9999999999, killType: Encounters)
                    }                
                }

		    }
	    }
    }`;

    const result = await fetch(WCLUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token_type} ${auth.access_token}`,
        },
        body: JSON.stringify({ query })
    });

    const json: CharacterData = await result.json();
    const report: PlayerReport = json.data.characterData.character.recentReports;

    // add dps
    let entry: PlayerDetails[] = [];
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.dps.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.dps[i])
    }
    // add heals
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.healers.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.healers[i])
    }
    // add tanks
    for (let i = 0; i < report.data[0].playerDetails.data.playerDetails.tanks.length; i++) {
        entry.push(report.data[0].playerDetails.data.playerDetails.tanks[i])
    }

    return entry;
}