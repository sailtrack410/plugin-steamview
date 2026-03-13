import { axiosInstance } from '@halo-dev/api-client'

const CONSOLE_API_PREFIX = '/apis/console.api.steamview.halo.run/v1alpha1'
const PUBLIC_API_PREFIX = '/apis/api.steamview.halo.run/v1alpha1'

export interface SteamGameItem {
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

export interface SteamGamesStats {
  totalGames: number
  totalTime: number
  twoWeekTime: number
  activeGames: number
}

export interface SteamGamesSummary {
  allGames: number
  hiddenGames: number
  visibleGames: number
}

export interface SteamPlayerBadge {
  badgeId: number
  level: number
  completionTime: number
  xp: number
  scarcity: number
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

export interface SteamGamesListResult {
  items: SteamGameItem[]
  page: number
  size: number
  total: number
  stats: SteamGamesStats
  summary: SteamGamesSummary
  lastUpdated: string
  ingestedBy: string
  player: SteamPlayerInfo
}

export interface SteamPublicGamesResult {
  games: SteamGameItem[]
  stats: SteamGamesStats
  player: SteamPlayerInfo
  lastUpdated: string
}

export interface SteamConnectionResult {
  success: boolean
  message: string
  gameCount?: number
}

export interface SteamGamesQuery {
  page: number
  size: number
  keyword?: string
  sort?: string
  hidden?: string
  activity?: string
}

export const getConsoleGames = async (query: SteamGamesQuery) => {
  const { data } = await axiosInstance.get<SteamGamesListResult>(`${CONSOLE_API_PREFIX}/games`, {
    params: query,
  })
  return data
}

export const getPublicSteamGames = async () => {
  const { data } = await axiosInstance.get<SteamPublicGamesResult>(`${PUBLIC_API_PREFIX}/games`)
  return data
}

export const refreshSteamGames = async () => {
  const { data } = await axiosInstance.post<{ success: boolean; message: string }>(
    `${CONSOLE_API_PREFIX}/games/-/refresh`,
  )
  return data
}

export const testSteamConnection = async () => {
  const { data } = await axiosInstance.get<SteamConnectionResult>(`${CONSOLE_API_PREFIX}/connection/test`)
  return data
}

export const hideSteamGame = async (appId: string) => {
  const { data } = await axiosInstance.post<{ success: boolean; message: string }>(
    `${CONSOLE_API_PREFIX}/games/${encodeURIComponent(appId)}/hide`,
  )
  return data
}

export const unhideSteamGame = async (appId: string) => {
  const { data } = await axiosInstance.delete<{ success: boolean; message: string }>(
    `${CONSOLE_API_PREFIX}/games/${encodeURIComponent(appId)}/hide`,
  )
  return data
}
