export interface SteamGame {
  appId: string
  name: string
  coverUrl: string
  totalTime: number
  twoWeekTime: number
  totalPercent: number
  twoWeekPercent: number
  lastPlayed: string
  lastPlayedAt: number
  hidden: boolean
  active: boolean
}

export interface SteamStats {
  totalGames: number
  totalTime: number
  twoWeekTime: number
  activeGames: number
}

export interface SteamPlayerBadge {
  badgeId: number
  level: number
  completionTime: number
  xp: number
  scarcity: number
  appId?: number
  iconUrl?: string
}

export interface SteamPlayerInfo {
  steamId: string
  personaName: string
  profileUrl: string
  avatar: string
  avatarMedium: string
  avatarFull: string
  level: number
  badgeCount: number
  playerXp: number
  xpToNextLevel?: number
  badges: SteamPlayerBadge[]
}

export interface SteamPublicGamesResponse {
  games: SteamGame[]
  stats: SteamStats
  player: SteamPlayerInfo
  lastUpdated: string
}

export type SteamSortKey = 'twoWeekTime' | 'totalTime' | 'name' | 'lastPlayed'
