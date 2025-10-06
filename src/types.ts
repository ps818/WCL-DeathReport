export type WCLConfig = {
    clientSecret: string,
    clientId: string
    zoneId: number,
    difficulty: number,
    wipeCutOff: number,
};

export type WCLBearer = {
    token_type: string,
    expires_in: number,
    access_token: string
};

export type CharacterData = {
    data: {
        characterData: {
            character: {
                name: string,
                recentReports: any
            }
        }
    }
};

export type CharacterFightReport = {
    has_more_pages: boolean,
    last_page: number,
    current_page: number,
    data: {
        zone: {
            id: number,
            difficulties: Difficulty[]
        },
        fights: FightDetail[]
    }[]
};

type Difficulty = {
    id: number
}

export type Character = {
    name: string,
    server: string,
    region: string
};

export type ProcessPlayerDeaths = {
    [name: string]: {
        fights: number,
        deaths: number,
        percent: number,
    },
};

export type PlayerData = {
    data: {
        reportData: {
            reports: PlayerReport
        }
    }
};

export type PlayerReport = {
    has_more_pages: boolean,
    last_page: number,
    total: number,
    data: {
        playerDetails: {
            data: {
                playerDetails: {
                    tanks: PlayerDetails[],
                    healers: PlayerDetails[],
                    dps: PlayerDetails[]
                }
            }
        }
    }[]
};

export type PlayerDetails = {
    name: string,
    id: number,
    guid: number,
    type: string,
    server: string,
    region: string,
    icon: string,
    specs: Spec[],
    minItemLevel: number,
    maxItemLevel: number,
    potionUse: number,
    healthstoneUse: number,
    combatantInfo: any[]
}

type Spec = {
    spec: string,
    count: number
};

export type FightData = {
    data: {
        reportData: {
            reports: FightReport
        }
    }
};

export type FightReport = {
    has_more_pages: boolean,
    last_page: number,
    total: number,
    data: Fight[]
};

type Fight = {
    fights: FightDetail[]
};

type FightDetail = {
    id: number,
    name: string,
    friendlyPlayers: number[]
};

export type ReportData = {
    data: {
        reportData: {
            reports: Report
        }
    }
};

export type Report = {
    has_more_pages: boolean,
    last_page: number,
    total: number,
    data: Table[]
};

type Table = {
    table: {
        data: tableData
    }
};

type tableData = {
    entries: deathEntry[]
};

export type deathEntry = {
    name: string,
    id: number,
    guid: number,
    type: string,
    icon: string,
    timestamp: number,
    fight: number,
    damage: Damage,
    healing: Healing,
    deathWindow: number,
    overkill?: number,
    events: Events[],
    killingBlow: EventAbility,
};

type Damage = {
    total: number,
    totalReduced?: number,
    activeTime: number,
    activeTimeReduced: number,
    overheal?: number,
    abilities: Ability[],
    damageAbilities: Ability[],
    sources: Source[],
    blocked?: number
};

type Ability = {
    name: string,
    total: number,
    type: number,
    totalReduced?: number,
    petName?: string,
};

type Source = {
    name: string,
    total: number,
    type: string,
    totalReduced?: number
};

type Healing = {
    total: number,
    totalReduced?: number,
    activeTime: number,
    activeTimeReduced: number,
    abilities: Ability[],
    damageAbilities: Ability[],
    sources: Source[]
};

type Events = {
    timestamp: number,
    type: string,
    sourceID?: number,
    sourceIsFriendly: boolean,
    targetID: number,
    targetisFriendly: boolean,
    ability: EventAbility,
    fight: number,
    hitType: number,
    amount: number,
    mitigated?: number,
    unmitigatedAmount: number,
    overkill?: number,
    isAoE: boolean,
    tick?: boolean,
    absorbed?: number,
    targetMarker?: number,
    sourceInstance?: number,
    sourceMarker?: number,
    source?: SourceEvent
};

type EventAbility = {
    name: string,
    guid: number,
    type: number,
    abilityIcon: string
};

type SourceEvent = {
    name: string,
    id: number,
    guid: number,
    type: string,
    icon: string
};

