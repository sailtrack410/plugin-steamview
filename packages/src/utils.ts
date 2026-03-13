import type { SteamGame, SteamSortKey } from './types'

export function getApiBase(): string {
  return (
    (window as Window & { __STEAMVIEW_API_BASE__?: string }).__STEAMVIEW_API_BASE__ ||
    '/apis/api.steamview.halo.run/v1alpha1/games'
  )
}

export function formatMinutes(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes || 0))
  const hours = Math.floor(safeMinutes / 60)
  const mins = safeMinutes % 60
  if (hours <= 0) {
    return `${mins} 分钟`
  }
  if (mins <= 0) {
    return `${hours} 小时`
  }
  return `${hours} 小时 ${mins} 分钟`
}

export function formatLastPlayed(lastPlayed: string, lastPlayedAt: number): string {
  if (lastPlayedAt > 0) {
    const date = new Date(lastPlayedAt * 1000)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('zh-CN')
    }
  }
  return lastPlayed || '从未游玩'
}

export function formatUpdatedAt(value: string): string {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

export function sortGames(games: SteamGame[], sortBy: SteamSortKey): SteamGame[] {
  const cloned = [...games]
  switch (sortBy) {
    case 'name':
      return cloned.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    case 'totalTime':
      return cloned.sort((a, b) => b.totalTime - a.totalTime)
    case 'lastPlayed':
      return cloned.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
    case 'twoWeekTime':
    default:
      return cloned.sort((a, b) => b.twoWeekTime - a.twoWeekTime)
  }
}
