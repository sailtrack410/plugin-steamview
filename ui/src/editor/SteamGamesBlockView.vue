<script setup lang="ts">
import { computed, ref } from 'vue'
import { NodeViewWrapper, type NodeViewProps } from '@halo-dev/richtext-editor'
import { VButton, VEmpty } from '@halo-dev/components'
import SteamGamesPickerModal from './SteamGamesPickerModal.vue'

type SteamRenderMode = 'all' | 'single'

const props = defineProps<NodeViewProps>()

const modalVisible = ref(false)

const openConfig = () => {
  window.setTimeout(() => {
    modalVisible.value = true
  }, 0)
}

const mode = computed<SteamRenderMode>(() => {
  return props.node?.attrs.mode === 'single' ? 'single' : 'all'
})

const showProfile = computed<boolean>(() => {
  return props.node?.attrs.showProfile !== false
})

const selectedAppId = computed(() => props.node?.attrs.appId || '')
const selectedAppName = computed(() => props.node?.attrs.appName || '')

const modeText = computed(() => {
  return mode.value === 'single' ? '单个游戏渲染' : '全部游戏渲染'
})

const profileText = computed(() => {
  if (mode.value === 'single') {
    return '单个游戏模式下始终展示玩家信息'
  }
  return showProfile.value ? '展示玩家信息' : '不展示玩家信息'
})

const handleApply = (payload: {
  mode: SteamRenderMode
  showProfile: boolean
  appId: string
  appName: string
  coverUrl: string
}) => {
  props.updateAttributes(payload)
  modalVisible.value = false
}
</script>

<template>
  <node-view-wrapper
    as="div"
    :class="['steam-games-block', { 'steam-games-block--selected': selected }]"
  >
    <div
      class="steam-games-block__shell"
      contenteditable="false"
      @click.stop
      @mousedown.stop
      @pointerdown.stop
    >
      <div class="steam-games-block__header">
        <div class="steam-games-block__header-main">
          <p class="steam-games-block__title">Steam 展示卡片</p>
          <p class="steam-games-block__subtitle">编辑器中仅显示配置摘要，发布后按配置渲染</p>
        </div>
        <VButton size="sm" type="secondary" @click="openConfig">配置</VButton>
      </div>

      <div class="steam-games-block__meta">
        <div class="steam-games-block__meta-item">
          <span class="steam-games-block__label">渲染模式</span>
          <span class="steam-games-block__value">{{ modeText }}</span>
        </div>
        <div class="steam-games-block__meta-item">
          <span class="steam-games-block__label">个人信息</span>
          <span class="steam-games-block__value">{{ profileText }}</span>
        </div>
        <div class="steam-games-block__meta-item">
          <span class="steam-games-block__label">目标游戏</span>
          <span class="steam-games-block__value">
            {{ mode === 'single' ? (selectedAppName || (selectedAppId ? `App ${selectedAppId}` : '未选择')) : '全部游戏' }}
          </span>
        </div>
      </div>

      <VEmpty
        v-if="mode === 'single' && !selectedAppId"
        title="未选择游戏"
        message="当前为单个游戏渲染模式，请点击配置选择游戏。"
      />
    </div>

    <SteamGamesPickerModal
      v-if="modalVisible"
      :initial-mode="mode"
      :initial-show-profile="showProfile"
      :initial-app-id="selectedAppId"
      @close="modalVisible = false"
      @apply="handleApply"
    />
  </node-view-wrapper>
</template>

<style scoped lang="scss">
.steam-games-block {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid #d6deea;
  border-radius: 12px;
  background: #f8fafc;
}

.steam-games-block--selected {
  border-color: #94a3b8;
  box-shadow: 0 0 0 2px rgb(148 163 184 / 0.25);
}

.steam-games-block__shell {
  background: #fff;
  border: 1px solid #e2e8f2;
  border-radius: 10px;
  padding: 12px;
}

.steam-games-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.steam-games-block__header-main {
  min-width: 0;
}

.steam-games-block__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.steam-games-block__subtitle {
  color: #6b7280;
  font-size: 12px;
  margin: 4px 0 0;
}

.steam-games-block__meta {
  display: grid;
  gap: 8px;
  margin-top: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.steam-games-block__meta-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  min-height: 52px;
}

.steam-games-block__label {
  color: #64748b;
  display: block;
  font-size: 12px;
  line-height: 1.3;
  margin-bottom: 4px;
}

.steam-games-block__value {
  color: #111827;
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-all;
}

@media (max-width: 768px) {
  .steam-games-block__meta {
    grid-template-columns: 1fr;
  }
}
</style>
