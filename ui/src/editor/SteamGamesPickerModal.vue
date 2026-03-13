<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { IconRefreshLine, Toast, VButton, VEmpty, VLoading, VModal, VSpace } from '@halo-dev/components'
import { getPublicSteamGames } from '@/api/steam'

type SteamRenderMode = 'all' | 'single'

const props = defineProps<{
  initialMode: SteamRenderMode
  initialShowProfile: boolean
  initialAppId: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (
    event: 'apply',
    value: {
      mode: SteamRenderMode
      showProfile: boolean
      appId: string
      appName: string
      coverUrl: string
    },
  ): void
}>()

const modal = ref<InstanceType<typeof VModal> | null>(null)
const mode = ref<SteamRenderMode>(props.initialMode === 'single' ? 'single' : 'all')
const showProfile = ref(props.initialShowProfile)
const keyword = ref('')
const selectedAppId = ref(props.initialAppId || '')

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['steamview:editor:public:games'],
  queryFn: getPublicSteamGames,
})

const games = computed(() => data.value?.games || [])

const filteredGames = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  if (!text) {
    return games.value
  }

  return games.value.filter((game) => {
    return game.name.toLowerCase().includes(text) || game.appId.toLowerCase().includes(text)
  })
})

const selectedGame = computed(() => {
  return games.value.find((game) => game.appId === selectedAppId.value) || null
})

const handleSubmit = () => {
  if (mode.value === 'single' && !selectedGame.value) {
    Toast.warning('请先选择一个游戏')
    return
  }

  emit('apply', {
    mode: mode.value,
    showProfile: showProfile.value,
    appId: selectedGame.value?.appId || '',
    appName: selectedGame.value?.name || '',
    coverUrl: selectedGame.value?.coverUrl || '',
  })

  modal.value?.close()
}

watch(mode, (value) => {
  if (value === 'all') {
    selectedAppId.value = ''
  }
})
</script>

<template>
  <VModal
    ref="modal"
    title="Steam 渲染设置"
    :width="920"
    :layer-closable="true"
    :mount-to-body="true"
    @close="emit('close')"
  >
    <div class="steam-picker">
      <div class="steam-picker__mode">
        <VSpace>
          <VButton :type="mode === 'all' ? 'secondary' : 'default'" @click="mode = 'all'">渲染全部</VButton>
          <VButton :type="mode === 'single' ? 'secondary' : 'default'" @click="mode = 'single'">渲染单个游戏</VButton>
        </VSpace>
      </div>

      <div v-if="mode === 'all'" class="steam-picker__all-config">
        <label class="steam-picker__checkbox">
          <input v-model="showProfile" type="checkbox" />
          <span>渲染个人资料信息（头像、等级、徽章等）</span>
        </label>
      </div>

      <div v-else class="steam-picker__single-config">
        <div class="steam-picker__toolbar">
          <input
            v-model="keyword"
            type="search"
            placeholder="搜索游戏名称或 App ID"
            autocomplete="off"
            spellcheck="false"
          />
          <div class="steam-picker__refresh" @click="refetch()">
            <IconRefreshLine
              v-tooltip="'刷新'"
              :class="{ 'steam-picker__refresh-icon--spinning': isFetching }"
              class="steam-picker__refresh-icon"
            />
          </div>
        </div>

        <VLoading v-if="isLoading" />
        <div v-else-if="filteredGames.length > 0" class="steam-picker__list">
          <button
            v-for="game in filteredGames"
            :key="game.appId"
            type="button"
            class="steam-picker__item"
            :class="{ 'steam-picker__item--active': selectedAppId === game.appId }"
            @click="selectedAppId = game.appId"
          >
            <img :src="game.coverUrl" :alt="game.name" loading="lazy" />
            <div class="steam-picker__item-info">
              <h4>{{ game.name }}</h4>
              <p>App {{ game.appId }}</p>
            </div>
          </button>
        </div>
        <VEmpty
          v-else
          title="没有匹配的游戏"
          message="尝试更换搜索关键词，或者点击刷新。"
        />
      </div>
    </div>

    <template #footer>
      <VSpace>
        <VButton type="secondary" @click="handleSubmit">确认</VButton>
        <VButton @click="modal?.close()">取消</VButton>
      </VSpace>
    </template>
  </VModal>
</template>

<style scoped lang="scss">
.steam-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.steam-picker__mode {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.steam-picker__all-config {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.steam-picker__checkbox {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
}

.steam-picker__toolbar {
  align-items: center;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.steam-picker__toolbar input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  min-height: 38px;
  padding: 0 12px;
  width: 100%;
}

.steam-picker__refresh {
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.steam-picker__refresh-icon {
  color: #4b5563;
  height: 16px;
  width: 16px;
}

.steam-picker__refresh-icon--spinning {
  animation: steam-spin 0.9s linear infinite;
}

.steam-picker__list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-height: 420px;
  overflow: auto;
  padding-right: 2px;
}

.steam-picker__item {
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 8px;
  text-align: left;
}

.steam-picker__item:hover {
  border-color: #9ca3af;
}

.steam-picker__item--active {
  border-color: #111827;
  box-shadow: inset 0 0 0 1px #111827;
}

.steam-picker__item img {
  border-radius: 6px;
  flex-shrink: 0;
  height: 52px;
  object-fit: cover;
  width: 98px;
}

.steam-picker__item-info {
  min-width: 0;
}

.steam-picker__item-info h4 {
  font-size: 14px;
  line-height: 1.35;
  margin: 0;
}

.steam-picker__item-info p {
  color: #6b7280;
  font-size: 12px;
  margin: 4px 0 0;
}

@media (max-width: 860px) {
  .steam-picker__list {
    grid-template-columns: 1fr;
  }
}

@keyframes steam-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
