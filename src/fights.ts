import { config, WCLUrl } from "./config.js";
import type { Character, CharacterData, FightData, FightReport, CharacterFightReport, WCLBearer } from "./types";

export async function getFights(auth: WCLBearer, page: number, guildId: number): Promise<FightReport> {
    const query = `
    {
        reportData {
            reports(guildID: ${guildId}, zoneID: ${config.zoneId}, limit: 1, page: ${page}) {
                has_more_pages
                last_page
                total
                data {
                    fights(difficulty: ${config.difficulty}, killType: Encounters) {
                        id
                        name
                        friendlyPlayers
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

    const json: FightData = await result.json();
    const fightreport: FightReport = json.data.reportData.reports;
    return fightreport;
}

export async function getCharacterFights(auth: WCLBearer, page: number, character: Character): Promise<CharacterFightReport> {
    const query = `
    {
        characterData {
            character(name: ${character.name}, serverSlug: ${character.server}, serverRegion: ${character.region}) {
                name
                recentReports(limit: 1, page: ${page}) {
                    has_more_pages
                    last_page
                    current_page
                    data {
                        zone {
                            id
                        }
                        fights(difficulty: 5, killType: Encounters) {
                            id
                            name
                            friendlyPlayers
                        }
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
    const fightreport: CharacterFightReport = json.data.characterData.character.recentReports;
    return fightreport;
}