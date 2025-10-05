import { config, WCLUrl } from "./config.js";
import { ReportData, Report, deathEntry, WCLBearer, Character, CharacterData } from "./types";

export async function getDeaths(auth: WCLBearer, page: number, guildId: number): Promise<deathEntry[]> {
    const query = `
    {
        reportData {
            reports(guildID: ${guildId}, zoneID: ${config.zoneId}, limit: 1, page: ${page}) {
                has_more_pages
                last_page
                total
                data {
                    table(startTime: 0, endTime: 9999999999, dataType: Deaths, difficulty: ${config.difficulty}, wipeCutoff: ${config.wipeCutOff}, killType: Encounters)
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
        body: JSON.stringify({ query }),
    });

    const json: ReportData = await result.json();
    const reports: Report = json.data.reportData.reports;
    const deaths: deathEntry[] = reports.data[0].table.data.entries;

    return deaths;
}

export async function getCharacterDeaths(auth: WCLBearer, page: number, character: Character): Promise<deathEntry[]> {
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
                        table(startTime: 0, endTime: 9999999999 difficulty: ${config.difficulty}, killType: Encounters, dataType: Deaths, wipeCutoff: ${config.wipeCutOff})
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
        body: JSON.stringify({ query }),
    });

    const json: CharacterData = await result.json();
    const report: Report = json.data.characterData.character.recentReports;
    const deaths: deathEntry[] = report.data[0].table.data.entries;

    return deaths;
}