import { LitElement, html, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { fetchSteamGames } from './api'
import { steamGamesStyles } from './styles'
import type { SteamGame, SteamPlayerInfo, SteamSortKey } from './types'
import { formatLastPlayed, formatMinutes, formatUpdatedAt, sortGames } from './utils'

const DEFAULT_PAGE_SIZE = 12

type ColorSchemeMode = 'auto' | 'dark' | 'light'
type ResolvedColorScheme = 'dark' | 'light'
type SteamRenderMode = 'all' | 'single'

@customElement('steam-games-view')
export class SteamGamesView extends LitElement {
  static styles = steamGamesStyles

  @property({ type: String, attribute: 'api-base' })
  apiBase = ''

  @property({ type: String })
  title = 'Steam 游戏展柜'

  @property({ type: String })
  subtitle = '最近游玩、总时长与活跃状态'

  @property({ type: String })
  mode: SteamRenderMode = 'all'

  @property({ type: String, attribute: 'app-id' })
  appId = ''

  @property({ type: Boolean, attribute: 'show-profile' })
  showProfile = true

  @property({ type: Boolean, reflect: true })
  embedded = false

  @state()
  private games: SteamGame[] = []

  @state()
  private loading = false

  @state()
  private error = ''

  @state()
  private sortBy: SteamSortKey = 'totalTime'

  @state()
  private keyword = ''

  @state()
  private visibleCount = DEFAULT_PAGE_SIZE

  @state()
  private lastUpdated = ''

  @state()
  private player: SteamPlayerInfo | null = null

  private colorSchemeMode: ColorSchemeMode = 'auto'
  private mediaQuery: MediaQueryList | null = null
  private colorSchemeObserver: MutationObserver | null = null
  private autoLoadObserver: IntersectionObserver | null = null

  private readonly handleMediaChange = (): void => {
    if (this.colorSchemeMode === 'auto') {
      this.syncColorSchemeFromDocument()
    }
  }

  private readonly handleDomReady = (): void => {
    if (!this.colorSchemeObserver || !document.body) {
      return
    }
    this.colorSchemeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-color-scheme'],
    })
    this.syncColorSchemeFromDocument()
  }

  private readonly handleAutoLoadIntersection = (entries: IntersectionObserverEntry[]): void => {
    if (!entries.some((entry) => entry.isIntersecting)) {
      return
    }
    this.loadMore()
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.setupColorSchemeSync()
    this.setupAutoLoadObserver()
    this.hydrateQueryState()
    this.visibleCount = DEFAULT_PAGE_SIZE
    void this.loadGames()
  }

  disconnectedCallback(): void {
    this.teardownColorSchemeSync()
    this.teardownAutoLoadObserver()
    super.disconnectedCallback()
  }

  protected updated(_changed: PropertyValues<this>): void {
    this.bindAutoLoadSentinel()
  }

  private setupAutoLoadObserver(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    this.autoLoadObserver = new IntersectionObserver(this.handleAutoLoadIntersection, {
      root: null,
      rootMargin: '280px 0px',
      threshold: 0.01,
    })
  }

  private teardownAutoLoadObserver(): void {
    if (this.autoLoadObserver) {
      this.autoLoadObserver.disconnect()
      this.autoLoadObserver = null
    }
  }

  private bindAutoLoadSentinel(): void {
    if (!this.autoLoadObserver) {
      return
    }

    this.autoLoadObserver.disconnect()

    if (
      this.mode === 'single' ||
      this.loading ||
      this.error ||
      this.visibleGames.length >= this.filteredGames.length
    ) {
      return
    }

    const sentinel = this.renderRoot.querySelector('.load-sentinel')
    if (sentinel) {
      this.autoLoadObserver.observe(sentinel)
    }
  }

  private setupColorSchemeSync(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof this.mediaQuery.addEventListener === 'function') {
      this.mediaQuery.addEventListener('change', this.handleMediaChange)
    } else {
      this.mediaQuery.addListener(this.handleMediaChange)
    }

    this.colorSchemeObserver = new MutationObserver(() => this.syncColorSchemeFromDocument())
    this.colorSchemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-color-scheme'],
    })

    if (document.body) {
      this.colorSchemeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'data-color-scheme'],
      })
    } else {
      window.addEventListener('DOMContentLoaded', this.handleDomReady, { once: true })
    }

    this.syncColorSchemeFromDocument()
  }

  private teardownColorSchemeSync(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('DOMContentLoaded', this.handleDomReady)
    }

    if (this.mediaQuery) {
      if (typeof this.mediaQuery.removeEventListener === 'function') {
        this.mediaQuery.removeEventListener('change', this.handleMediaChange)
      } else {
        this.mediaQuery.removeListener(this.handleMediaChange)
      }
    }

    if (this.colorSchemeObserver) {
      this.colorSchemeObserver.disconnect()
    }

    this.mediaQuery = null
    this.colorSchemeObserver = null
  }

  private syncColorSchemeFromDocument(): void {
    const mode = this.readColorSchemeMode(document.body) ?? this.readColorSchemeMode(document.documentElement) ?? 'auto'

    const resolved: ResolvedColorScheme = mode === 'auto' ? (this.mediaQuery?.matches ? 'dark' : 'light') : mode

    this.colorSchemeMode = mode
    this.setAttribute('data-color-scheme', resolved)
  }

  private readColorSchemeMode(element: Element | null): ColorSchemeMode | null {
    if (!element) {
      return null
    }

    const dataMode = (element.getAttribute('data-color-scheme') || '').trim().toLowerCase()
    const classMode = this.readClassColorSchemeMode(element)
    if (dataMode === 'dark' || classMode === 'dark') {
      return 'dark'
    }

    if (dataMode === 'light' || classMode === 'light') {
      return 'light'
    }

    if (dataMode === 'auto' || classMode === 'auto') {
      return 'auto'
    }

    return null
  }

  private readClassColorSchemeMode(element: Element): ColorSchemeMode | null {
    if (element.classList.contains('color-scheme-dark') || element.classList.contains('dark')) {
      return 'dark'
    }

    if (element.classList.contains('color-scheme-light') || element.classList.contains('light')) {
      return 'light'
    }

    if (element.classList.contains('color-scheme-auto')) {
      return 'auto'
    }

    return null
  }

  private hydrateQueryState(): void {
    if (this.mode === 'single') {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const sort = params.get('sort')
    if (q) {
      this.keyword = q
    }
    if (sort && this.isSortKey(sort)) {
      this.sortBy = sort
    }
  }

  private isSortKey(value: string): value is SteamSortKey {
    return value === 'twoWeekTime' || value === 'totalTime' || value === 'name' || value === 'lastPlayed'
  }

  private syncQueryState(): void {
    if (this.mode === 'single' || this.embedded) {
      return
    }

    const url = new URL(window.location.href)
    if (this.keyword) {
      url.searchParams.set('q', this.keyword)
    } else {
      url.searchParams.delete('q')
    }
    if (this.sortBy !== 'totalTime') {
      url.searchParams.set('sort', this.sortBy)
    } else {
      url.searchParams.delete('sort')
    }
    window.history.replaceState(null, '', url.toString())
  }

  private async loadGames(): Promise<void> {
    this.loading = true
    this.error = ''
    try {
      const response = await fetchSteamGames(this.apiBase)
      this.games = response.games.filter((game) => !game.hidden)
      this.player = response.player || null
      this.lastUpdated = response.lastUpdated
      this.visibleCount = DEFAULT_PAGE_SIZE
    } catch (error) {
      this.error = error instanceof Error ? error.message : '加载失败，请稍后重试'
      this.games = []
      this.player = null
    } finally {
      this.loading = false
    }
  }

  private onSearchInput(event: Event): void {
    this.keyword = (event.target as HTMLInputElement).value
    this.visibleCount = DEFAULT_PAGE_SIZE
    this.syncQueryState()
  }

  private onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value
    if (this.isSortKey(value)) {
      this.sortBy = value
      this.visibleCount = DEFAULT_PAGE_SIZE
      this.syncQueryState()
    }
  }

  private loadMore(): void {
    if (this.loading) {
      return
    }
    const batch = DEFAULT_PAGE_SIZE
    this.visibleCount = Math.min(this.visibleCount + batch, this.filteredGames.length)
  }

  private get filteredGames(): SteamGame[] {
    const scopedGames =
      this.mode === 'single'
        ? this.games.filter((game) => game.appId === this.appId)
        : this.games

    if (this.mode === 'single') {
      return scopedGames
    }

    const sorted = sortGames(scopedGames, this.sortBy)
    const normalizedKeyword = this.keyword.trim().toLowerCase()
    if (!normalizedKeyword) {
      return sorted
    }

    return sorted.filter((game) => {
      const name = game.name.toLowerCase()
      return name.includes(normalizedKeyword) || game.appId.includes(normalizedKeyword)
    })
  }

  private get visibleGames(): SteamGame[] {
    return this.filteredGames.slice(0, this.visibleCount)
  }

  private get summary() {
    const list = this.filteredGames
    const totalTime = list.reduce((sum, game) => sum + game.totalTime, 0)
    const twoWeekTime = list.reduce((sum, game) => sum + game.twoWeekTime, 0)
    const activeGames = list.filter((game) => game.active || game.twoWeekTime > 0).length

    return {
      gameCount: list.length,
      totalTime,
      twoWeekTime,
      activeGames,
    }
  }

  private renderProfile(summary: { gameCount: number; totalTime: number; twoWeekTime: number; activeGames: number }): unknown {
    const player = this.player
    const profileUrl = player?.profileUrl || ''
    const avatar = player?.avatarFull || player?.avatarMedium || player?.avatar || ''
    const displayName = player?.personaName || 'Steam 玩家'
    const displayLevel = player?.level || 0
    const displayBadgeCount = player?.badgeCount || 0

    return html`
      <aside class="profile-panel" aria-label="玩家资料面板">
        <div class="profile-head">
          ${avatar
            ? html`<img class="profile-avatar" src=${avatar} alt=${displayName} width="72" height="72" />`
            : html`<div class="profile-avatar profile-avatar-fallback" aria-hidden="true">${displayName[0] || 'S'}</div>`}
          <div class="profile-main">
            <p class="profile-name">${displayName}</p>
            ${profileUrl
              ? html`
                  <a class="profile-link" href=${profileUrl} target="_blank" rel="noopener noreferrer">
                    打开 Steam 主页
                  </a>
                `
              : null}
          </div>
        </div>

        <dl class="profile-metrics profile-metrics-main">
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⬢</span>等级</dt>
            <dd>Lv.${displayLevel}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◇</span>徽章</dt>
            <dd>${displayBadgeCount}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">✦</span>总 XP</dt>
            <dd>${player?.playerXp || 0}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">⌗</span>游戏</dt>
            <dd>${summary.gameCount}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◷</span>总时长</dt>
            <dd>${formatMinutes(summary.totalTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">◶</span>两周</dt>
            <dd>${formatMinutes(summary.twoWeekTime)}</dd>
          </div>
          <div class="metric-chip">
            <dt><span class="metric-icon" aria-hidden="true">●</span>活跃</dt>
            <dd>${summary.activeGames}</dd>
          </div>
        </dl>
      </aside>
    `
  }

  private renderState(): unknown {
    if (this.loading) {
      return html`
        <div class="state" role="status" aria-live="polite">
          <div class="spinner" aria-hidden="true"></div>
          <h3>正在加载数据</h3>
          <p>正在拉取游戏列表和玩家资料，请稍候…</p>
        </div>
      `
    }

    if (this.error) {
      return html`
        <div class="state error" role="alert">
          <h3>加载失败</h3>
          <p>${this.error}</p>
          <button type="button" @click=${this.loadGames}>重试</button>
        </div>
      `
    }

    return null
  }

  render() {
    const state = this.renderState()
    const summary = this.summary
    const isSingleMode = this.mode === 'single'
    const hasMore = !isSingleMode && this.visibleGames.length < this.filteredGames.length
    const shouldShowProfile = isSingleMode || this.showProfile

    return html`
      <main class="shell">
        <div class="container">
          <h1 class="sr-only">${this.title}</h1>
          <p class="sr-only">${this.subtitle}</p>

          ${shouldShowProfile
            ? html`<section class="overview" aria-label="关键指标与玩家资料">${this.renderProfile(summary)}</section>`
            : null}

          ${state
            ? state
            : html`
                ${isSingleMode
                  ? html`
                      <section class="toolbar" aria-label="操作栏">
                        <div class="toolbar-actions">
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    `
                  : html`
                      <section class="toolbar" aria-label="筛选与排序">
                        <label class="field field-search">
                          <span class="sr-only">搜索游戏</span>
                          <input
                            type="search"
                            name="game-search"
                            aria-controls="steam-games-list"
                            .value=${this.keyword}
                            autocomplete="off"
                            spellcheck="false"
                            placeholder="搜索游戏名称或 App ID"
                            @input=${this.onSearchInput}
                          />
                        </label>

                        <div class="toolbar-actions">
                          <label class="field field-sort">
                            <span class="sr-only">排序方式</span>
                            <select name="game-sort" @change=${this.onSortChange}>
                              <option value="totalTime" ?selected=${this.sortBy === 'totalTime'}>总时长优先</option>
                              <option value="twoWeekTime" ?selected=${this.sortBy === 'twoWeekTime'}>两周时长优先</option>
                              <option value="lastPlayed" ?selected=${this.sortBy === 'lastPlayed'}>最近游玩优先</option>
                              <option value="name" ?selected=${this.sortBy === 'name'}>名称 A-Z</option>
                            </select>
                          </label>
                          <button type="button" class="refresh-btn" @click=${this.loadGames}>刷新</button>
                        </div>
                      </section>
                    `}

                <div class="list-meta">
                  <span>展示 ${this.visibleGames.length} / ${this.filteredGames.length} 个游戏</span>
                  <span>${isSingleMode ? `单游戏模式 ${this.appId || ''}` : `最近更新 ${formatUpdatedAt(this.lastUpdated)}`}</span>
                </div>

                ${this.filteredGames.length === 0
                  ? html`
                      <div class="state">
                        <h3>${isSingleMode ? '未找到指定游戏' : '暂无可展示游戏'}</h3>
                        <p>${isSingleMode ? '请确认 App ID 是否正确，或稍后刷新数据。' : '请检查 Steam 配置，或稍后刷新数据。'}</p>
                      </div>
                    `
                  : html`
                      <section id="steam-games-list" class="game-waterfall" aria-label="Steam 游戏瀑布流列表">
                        ${this.visibleGames.map(
                          (game, index) => html`
                            <article class="game-card" style=${`--order:${index};`}>
                              <a
                                class="cover-link"
                                href=${`https://store.steampowered.com/app/${game.appId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label=${`在 Steam 商店打开 ${game.name}`}
                              >
                                <img
                                  class="game-cover"
                                  src=${game.coverUrl}
                                  alt=${game.name}
                                  width="460"
                                  height="215"
                                  loading=${index < 6 ? 'eager' : 'lazy'}
                                  fetchpriority=${index < 3 ? 'high' : 'auto'}
                                />
                              </a>

                              <div class="game-body">
                                <div class="game-head">
                                  <h2 class="game-name">${game.name}</h2>
                                  ${game.active || game.twoWeekTime > 0 ? html`<span class="active-tag">活跃</span>` : null}
                                </div>

                                <p class="game-meta">
                                  <span>App ${game.appId}</span>
                                  <span>${formatLastPlayed(game.lastPlayed, game.lastPlayedAt)}</span>
                                </p>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>总时长</span>
                                    <span>${formatMinutes(game.totalTime)}</span>
                                  </div>
                                  <div class="progress" aria-hidden="true">
                                    <i style="width:${Math.max(0, Math.min(100, game.totalPercent))}%"></i>
                                  </div>
                                </div>

                                <div class="metric-block">
                                  <div class="metric-row">
                                    <span>最近两周</span>
                                    <span>${formatMinutes(game.twoWeekTime)}</span>
                                  </div>
                                  <div class="progress progress-two-week" aria-hidden="true">
                                    <i style="width:${Math.max(0, Math.min(100, game.twoWeekPercent))}%"></i>
                                  </div>
                                </div>
                              </div>
                            </article>
                          `,
                        )}
                      </section>

                      ${hasMore
                        ? html`
                            <div class="load-zone" aria-hidden="true">
                              <div class="load-sentinel"></div>
                              <p class="loading-hint">下拉自动加载更多</p>
                            </div>
                          `
                        : html`<p class="loading-hint done">已全部加载</p>`}
                    `}
              `}

          <div class="sr-only" aria-live="polite">
            ${this.loading
              ? '正在加载数据'
              : this.error
                ? `加载失败：${this.error}`
                : `已加载 ${this.filteredGames.length} 个游戏`}
          </div>
        </div>
      </main>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'steam-games-view': SteamGamesView
  }
}
