<script setup lang="ts">
import {
  Dialog,
  IconRefreshLine,
  Toast,
  VButton,
  VCard,
  VDropdownItem,
  VEmpty,
  VEntity,
  VEntityContainer,
  VEntityField,
  VLoading,
  VPageHeader,
  VPagination,
  VSpace,
  VStatusDot,
} from '@halo-dev/components'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { utils } from '@halo-dev/ui-shared'
import {
  getConsoleGames,
  hideSteamGame,
  refreshSteamGames,
  testSteamConnection,
  type SteamGameItem,
  unhideSteamGame,
} from '@/api/steam'
import { formatTime } from '@/utils/time'

const page = ref(1)
const size = ref(20)
const keyword = ref('')
const selectedSort = ref<string | undefined>('twoWeekTime')
const selectedHidden = ref<string | undefined>()
const selectedActivity = ref<string | undefined>()
const checkAll = ref(false)
const selectedGameIds = ref<string[]>([])

const refreshing = ref(false)
const testing = ref(false)

const canManage = computed(() => utils.permission.has(['plugin:steamview:manage']))

const hasFilters = computed(() => {
  return Boolean(
    selectedHidden.value ||
      selectedActivity.value ||
      (selectedSort.value && selectedSort.value !== 'twoWeekTime'),
  )
})

const hiddenFilterItems = [
  { label: '全部', value: undefined },
  { label: '仅可见', value: 'visible' },
  { label: '仅隐藏', value: 'hidden' },
]

const activityFilterItems = [
  { label: '全部状态', value: undefined },
  { label: '两周活跃', value: 'active' },
  { label: '两周未活跃', value: 'inactive' },
]

const sortItems = [
  { label: '两周时长优先', value: 'twoWeekTime' },
  { label: '总时长优先', value: 'totalTime' },
  { label: '名称 A-Z', value: 'name' },
  { label: '最近游玩', value: 'lastPlayed' },
]

const queryKey = computed(() => [
  'steamview:console:games',
  page.value,
  size.value,
  keyword.value,
  selectedSort.value ?? 'twoWeekTime',
  selectedHidden.value ?? 'all',
  selectedActivity.value ?? 'all',
])

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey,
  queryFn: () =>
    getConsoleGames({
      page: page.value,
      size: size.value,
      keyword: keyword.value || undefined,
      sort: selectedSort.value,
      hidden: selectedHidden.value,
      activity: selectedActivity.value,
    }),
})

const games = computed(() => data.value?.items || [])
const total = computed(() => data.value?.total || 0)
const stats = computed(() =>
  data.value?.stats || {
    totalGames: 0,
    totalTime: 0,
    twoWeekTime: 0,
    activeGames: 0,
  },
)
const summary = computed(() =>
  data.value?.summary || {
    allGames: 0,
    hiddenGames: 0,
    visibleGames: 0,
  },
)
const lastUpdated = computed(() => data.value?.lastUpdated || '')
const ingestedBy = computed(() => data.value?.ingestedBy || 'system')
const player = computed(() => {
  return (
    data.value?.player || {
      steamId: '',
      personaName: '',
      profileUrl: '',
      avatar: '',
      avatarMedium: '',
      avatarFull: '',
      level: 0,
      badgeCount: 0,
      playerXp: 0,
      badges: [],
    }
  )
})
const playerName = computed(() => player.value.personaName || 'Steam 玩家')
const playerAvatar = computed(
  () => player.value.avatarFull || player.value.avatarMedium || player.value.avatar || '',
)

const selectedGames = computed(() => {
  const selected = new Set(selectedGameIds.value)
  return games.value.filter((game) => selected.has(game.appId))
})

const clearSelection = () => {
  selectedGameIds.value = []
  checkAll.value = false
}

const handleCheckAllChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  selectedGameIds.value = checked ? games.value.map((game) => game.appId) : []
}

const checkSelection = (game: SteamGameItem) => selectedGameIds.value.includes(game.appId)

const handleClearFilters = () => {
  selectedHidden.value = undefined
  selectedActivity.value = undefined
  selectedSort.value = 'twoWeekTime'
}

const visitFrontend = () => {
  window.open(`${window.location.origin}/steamview`, '_blank')
}

const openPlayerProfile = () => {
  if (player.value.profileUrl) {
    window.open(player.value.profileUrl, '_blank')
  }
}

const handleRefresh = async () => {
  if (!canManage.value) {
    Toast.warning('没有刷新权限')
    return
  }

  refreshing.value = true
  try {
    const result = await refreshSteamGames()
    if (result.success) {
      Toast.success(result.message || '刷新成功')
    } else {
      Toast.error(result.message || '刷新失败')
    }
    await refetch()
  } catch (error) {
    console.error(error)
    Toast.error('刷新失败')
  } finally {
    refreshing.value = false
  }
}

const handleTestConnection = async () => {
  if (!canManage.value) {
    Toast.warning('没有测试权限')
    return
  }

  testing.value = true
  try {
    const result = await testSteamConnection()
    if (result.success) {
      Toast.success(result.message || '连接成功')
    } else {
      Toast.error(result.message || '连接失败')
    }
  } catch (error) {
    console.error(error)
    Toast.error('连接测试失败')
  } finally {
    testing.value = false
  }
}

const applyHiddenAction = async (targetGames: SteamGameItem[], hidden: boolean) => {
  if (!targetGames.length) {
    Toast.warning(hidden ? '没有可隐藏的游戏' : '没有可取消隐藏的游戏')
    return
  }

  const results = await Promise.allSettled(
    targetGames.map((game) => (hidden ? hideSteamGame(game.appId) : unhideSteamGame(game.appId))),
  )

  const successCount = results.filter((result) => result.status === 'fulfilled').length
  const failedCount = results.length - successCount

  if (failedCount === 0) {
    Toast.success(hidden ? `已隐藏 ${successCount} 个游戏` : `已取消隐藏 ${successCount} 个游戏`)
  } else {
    Toast.warning(
      hidden
        ? `隐藏完成：成功 ${successCount}，失败 ${failedCount}`
        : `取消隐藏完成：成功 ${successCount}，失败 ${failedCount}`,
    )
  }

  clearSelection()
  await refetch()
}

const handleToggleHidden = (game: SteamGameItem, hidden: boolean) => {
  const title = hidden ? '确认隐藏游戏' : '确认取消隐藏'
  const description = hidden
    ? `隐藏后前台不再显示「${game.name}」。`
    : `取消隐藏后前台会重新显示「${game.name}」。`

  Dialog.warning({
    title,
    description,
    confirmText: '继续',
    cancelText: '取消',
    onConfirm: async () => {
      await applyHiddenAction([game], hidden)
    },
  })
}

const handleHideSelected = () => {
  const targets = selectedGames.value.filter((game) => !game.hidden)
  if (!targets.length) {
    Toast.warning('所选游戏都已经是隐藏状态')
    return
  }

  Dialog.warning({
    title: `批量隐藏（${targets.length}）`,
    description: '隐藏后前台页面将不会显示这些游戏。',
    confirmText: '继续',
    cancelText: '取消',
    onConfirm: async () => {
      await applyHiddenAction(targets, true)
    },
  })
}

const handleUnhideSelected = () => {
  const targets = selectedGames.value.filter((game) => game.hidden)
  if (!targets.length) {
    Toast.warning('所选游戏都处于可见状态')
    return
  }

  Dialog.warning({
    title: `批量取消隐藏（${targets.length}）`,
    description: '取消隐藏后前台页面会重新显示这些游戏。',
    confirmText: '继续',
    cancelText: '取消',
    onConfirm: async () => {
      await applyHiddenAction(targets, false)
    },
  })
}

const openSteamStore = (appId: string) => {
  window.open(`https://store.steampowered.com/app/${appId}`, '_blank')
}

const formatDateTime = (value: string) => {
  if (!value) {
    return '-'
  }
  try {
    return utils.date.format(value)
  } catch {
    return value
  }
}

watch([keyword, selectedSort, selectedHidden, selectedActivity], () => {
  page.value = 1
})

watch(
  () => selectedGameIds.value,
  (value) => {
    checkAll.value = games.value.length > 0 && value.length === games.value.length
  },
)

watch(
  () => games.value.map((game) => game.appId).join(','),
  () => {
    const visibleIds = new Set(games.value.map((game) => game.appId))
    selectedGameIds.value = selectedGameIds.value.filter((id) => visibleIds.has(id))
  },
)
</script>

<template>
  <VPageHeader title="Steam 游戏管理">
    <template #actions>
      <VSpace>
        <VButton @click="visitFrontend">访问前台</VButton>
        <VButton v-permission="['plugin:steamview:manage']" :loading="testing" @click="handleTestConnection">
          测试连接
        </VButton>
        <VButton
          v-permission="['plugin:steamview:manage']"
          type="secondary"
          :loading="refreshing"
          @click="handleRefresh"
        >
          <template #icon>
            <IconRefreshLine class="h-full w-full" />
          </template>
          刷新数据
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>

  <div class="m-0 md:m-4">
    <VCard class="mb-4">
      <div class="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div class="flex min-w-0 items-center gap-3">
          <img v-if="playerAvatar" :src="playerAvatar" :alt="playerName" class="player-avatar" />
          <div v-else class="player-avatar player-avatar-fallback" aria-hidden="true">
            {{ playerName.slice(0, 1).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-gray-900">{{ playerName }}</div>
            <div class="mt-1 text-xs text-gray-500">
              SteamID: {{ player.steamId || '-' }} · 等级 Lv.{{ player.level || 0 }} · 徽章
              {{ player.badgeCount || 0 }}
            </div>
          </div>
        </div>
        <VButton v-if="player.profileUrl" size="sm" @click="openPlayerProfile">打开 Steam 主页</VButton>
      </div>
    </VCard>

    <VCard :body-class="['!p-0']">
      <template #header>
        <div class="block w-full bg-gray-50 px-4 py-3">
          <div class="relative flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center">
            <div v-permission="['plugin:steamview:manage']" class="hidden items-center sm:flex">
              <input v-model="checkAll" type="checkbox" @change="handleCheckAllChange" />
            </div>

            <div class="flex w-full flex-1 items-center sm:w-auto">
              <SearchInput v-if="!selectedGameIds.length" v-model="keyword" placeholder="搜索游戏名称或 App ID" />
              <VSpace v-else v-permission="['plugin:steamview:manage']" spacing="sm" class="flex-wrap">
                <VButton @click="handleHideSelected">批量隐藏</VButton>
                <VButton @click="handleUnhideSelected">批量取消隐藏</VButton>
              </VSpace>
            </div>

            <VSpace spacing="lg" class="flex-wrap">
              <FilterCleanButton v-if="hasFilters" @click="handleClearFilters" />
              <FilterDropdown v-model="selectedHidden" label="可见性" :items="hiddenFilterItems" />
              <FilterDropdown v-model="selectedActivity" label="活跃度" :items="activityFilterItems" />
              <FilterDropdown v-model="selectedSort" label="排序" :items="sortItems" />
              <div class="flex flex-row gap-2">
                <button
                  type="button"
                  class="group cursor-pointer rounded border-0 bg-transparent p-1 hover:bg-gray-200"
                  aria-label="刷新列表"
                  @click="refetch()"
                >
                  <IconRefreshLine
                    v-tooltip="'刷新列表'"
                    :class="{ 'animate-spin text-gray-900': isFetching }"
                    class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                  />
                </button>
              </div>
            </VSpace>
          </div>
        </div>
      </template>

      <VLoading v-if="isLoading" />

      <Transition v-else-if="!games.length" appear name="fade">
        <VEmpty title="暂无游戏数据" message="请先配置 Steam API Key 与 Steam ID，然后点击刷新。">
          <template #actions>
            <VSpace>
              <VButton @click="refetch()">刷新</VButton>
            </VSpace>
          </template>
        </VEmpty>
      </Transition>

      <Transition v-else appear name="fade">
        <VEntityContainer>
          <VEntity v-for="game in games" :key="game.appId" :is-selected="checkSelection(game)">
            <template #checkbox>
              <input
                v-permission="['plugin:steamview:manage']"
                v-model="selectedGameIds"
                :value="game.appId"
                name="game-checkbox"
                type="checkbox"
              />
            </template>

            <template #start>
              <VEntityField>
                <template #title>
                  <div class="flex min-w-0 items-center gap-3">
                    <img :src="game.coverUrl" :alt="game.name" class="steam-cover" />
                    <div class="min-w-0">
                      <div class="truncate font-semibold text-gray-900">{{ game.name }}</div>
                      <div class="text-xs text-gray-500">App ID: {{ game.appId }}</div>
                    </div>
                  </div>
                </template>
                <template #description>
                  <div class="mt-1 text-xs text-gray-500">入库人：{{ ingestedBy }}</div>
                </template>
              </VEntityField>
            </template>

            <template #end>
              <VEntityField>
                <template #description>
                  <VStatusDot
                    :state="game.hidden ? 'warning' : 'success'"
                    :text="game.hidden ? '隐藏' : '可见'"
                    :animate="false"
                  />
                </template>
              </VEntityField>
              <VEntityField>
                <template #description>
                  <span class="text-xs text-gray-700">总时长 {{ formatTime(game.totalTime) }}</span>
                </template>
              </VEntityField>
              <VEntityField>
                <template #description>
                  <span class="text-xs text-gray-700">两周 {{ formatTime(game.twoWeekTime) }}</span>
                </template>
              </VEntityField>
              <VEntityField>
                <template #description>
                  <span class="text-xs tabular-nums text-gray-500">
                    {{
                      game.lastPlayedAt > 0
                        ? formatDateTime(new Date(game.lastPlayedAt * 1000).toISOString())
                        : game.lastPlayed
                    }}
                  </span>
                </template>
              </VEntityField>
            </template>

            <template #dropdownItems>
              <VDropdownItem @click="openSteamStore(game.appId)">打开 Steam 商店页</VDropdownItem>
              <VDropdownItem
                v-if="!game.hidden"
                v-permission="['plugin:steamview:manage']"
                @click="handleToggleHidden(game, true)"
              >
                隐藏
              </VDropdownItem>
              <VDropdownItem
                v-else
                v-permission="['plugin:steamview:manage']"
                @click="handleToggleHidden(game, false)"
              >
                取消隐藏
              </VDropdownItem>
            </template>
          </VEntity>
        </VEntityContainer>
      </Transition>

      <template #footer>
        <div class="space-y-3 px-4 py-3">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>总游戏 {{ summary.allGames }}，隐藏 {{ summary.hiddenGames }}，可见 {{ summary.visibleGames }}</span>
            <span>最近更新：{{ formatDateTime(lastUpdated) }}</span>
          </div>
          <VPagination
            v-model:page="page"
            v-model:size="size"
            :total="total"
            page-label="页"
            size-label="条 / 页"
            :size-options="[20, 50, 100]"
            :total-label="`共 ${total} 个游戏，活跃 ${stats.activeGames} 个`"
          />
        </div>
      </template>
    </VCard>
  </div>
</template>

<style scoped>
.steam-cover {
  width: 96px;
  height: 45px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  object-fit: cover;
}

.player-avatar {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  object-fit: cover;
}

.player-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%);
  color: #1f2937;
  font-size: 14px;
  font-weight: 700;
}
</style>
