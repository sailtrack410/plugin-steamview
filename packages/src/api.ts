import type { SteamPublicGamesResponse } from './types'
import { getApiBase } from './utils'

const EMPTY_RESPONSE: SteamPublicGamesResponse = {
  games: [],
  stats: {
    totalGames: 0,
    totalTime: 0,
    twoWeekTime: 0,
    activeGames: 0,
  },
  player: {
    steamId: '',
    personaName: '',
    profileUrl: '',
    avatar: '',
    avatarMedium: '',
    avatarFull: '',
    level: 0,
    badgeCount: 0,
    playerXp: 0,
    xpToNextLevel: undefined,
    badges: [],
  },
  lastUpdated: '',
}

export async function fetchSteamGames(apiBase?: string): Promise<SteamPublicGamesResponse> {
  const endpoint = (apiBase || getApiBase()).trim()
  if (!endpoint) {
    return EMPTY_RESPONSE
  }

  const response = await fetch(endpoint, { credentials: 'omit' })
  if (!response.ok) {
    throw new Error(`获取 Steam 游戏失败: HTTP ${response.status}`)
  }

  const payload = (await response.json()) as Partial<SteamPublicGamesResponse>
  return {
    games: Array.isArray(payload.games) ? payload.games : [],
    stats: payload.stats || EMPTY_RESPONSE.stats,
    player: payload.player || EMPTY_RESPONSE.player,
    lastUpdated: payload.lastUpdated || '',
  }
}
