import { markRaw } from 'vue'
import {
  BlockActionSeparator,
  Node,
  ToolboxItem,
  VueNodeViewRenderer,
  isActive,
  mergeAttributes,
  type Editor,
  type EditorState,
  type Range,
} from '@halo-dev/richtext-editor'
import RiDeleteBinLine from '~icons/ri/delete-bin-line'
import RiGamepadLine from '~icons/ri/gamepad-line'
import SteamGamesBlockView from './SteamGamesBlockView.vue'
import { deleteNode } from '@/utils/delete-node'

type SteamRenderMode = 'all' | 'single'

declare module '@halo-dev/richtext-editor' {
  interface Commands<ReturnType> {
    'steam-games-block': {
      setSteamGamesBlock: (options?: {
        mode?: SteamRenderMode
        showProfile?: boolean
        appId?: string
        appName?: string
        coverUrl?: string
      }) => ReturnType
    }
  }
}

const SteamGamesBlockExtension = Node.create({
  name: 'steam-games-block',
  fakeSelection: true,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      mode: {
        default: 'all',
        parseHTML: (element: HTMLElement) => {
          const mode = element.getAttribute('mode') || element.getAttribute('data-mode')
          return mode === 'single' ? 'single' : 'all'
        },
        renderHTML: (attributes: { mode?: SteamRenderMode }) => ({
          mode: attributes.mode === 'single' ? 'single' : 'all',
        }),
      },
      showProfile: {
        default: true,
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute('show-profile') || element.getAttribute('data-show-profile')
          return value !== 'false'
        },
        renderHTML: (attributes: { showProfile?: boolean }) => ({
          'show-profile': attributes.showProfile === false ? 'false' : 'true',
        }),
      },
      appId: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('app-id') || element.getAttribute('data-app-id') || '',
        renderHTML: (attributes: { appId?: string }) => ({
          'app-id': attributes.appId || '',
        }),
      },
      appName: {
        default: '',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('app-name') || element.getAttribute('data-app-name') || '',
        renderHTML: (attributes: { appName?: string }) => ({
          'app-name': attributes.appName || '',
        }),
      },
      coverUrl: {
        default: '',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('cover-url') || element.getAttribute('data-cover-url') || '',
        renderHTML: (attributes: { coverUrl?: string }) => ({
          'cover-url': attributes.coverUrl || '',
        }),
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'steam-games-renderer' },
      { tag: 'iframe[data-steam-games-renderer="true"]' },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const mode = HTMLAttributes.mode === 'single' ? 'single' : 'all'
    const showProfile = HTMLAttributes['show-profile'] !== 'false'
    const appId = String(HTMLAttributes['app-id'] || '')
    const appName = String(HTMLAttributes['app-name'] || '')
    const coverUrl = String(HTMLAttributes['cover-url'] || '')

    const params = new URLSearchParams()
    params.set('embedded', '1')
    params.set('mode', mode)
    params.set('showProfile', showProfile ? 'true' : 'false')
    if (mode === 'single' && appId) {
      params.set('appId', appId)
    }

    const src = `/steamview?${params.toString()}`

    return [
      'iframe',
      mergeAttributes({
        'data-steam-games-renderer': 'true',
        'data-mode': mode,
        'data-show-profile': showProfile ? 'true' : 'false',
        'data-app-id': appId,
        'data-app-name': appName,
        'data-cover-url': coverUrl,
        src,
        width: '100%',
        height: mode === 'single' ? '440' : '760',
        loading: 'lazy',
        style: 'border:0;border-radius:12px;overflow:hidden;',
      }),
    ]
  },

  addCommands() {
    return {
      setSteamGamesBlock:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent([
            {
              type: this.name,
              attrs: {
                mode: options.mode || 'all',
                showProfile: options.showProfile !== false,
                appId: options.appId || '',
                appName: options.appName || '',
                coverUrl: options.coverUrl || '',
              },
            },
            {
              type: 'paragraph',
              content: '',
            },
          ])
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(SteamGamesBlockView)
  },

  addOptions() {
    return {
      getCommandMenuItems() {
        return {
          priority: 198,
          icon: markRaw(RiGamepadLine),
          title: 'Steam 游戏展示',
          keywords: ['steam', 'game', 'steamview', '游戏展示'],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor.chain().focus().setSteamGamesBlock().deleteRange(range).run()
          },
        }
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return {
          priority: 58,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(RiGamepadLine),
            title: 'Steam 游戏展示',
            action: () => {
              editor.chain().focus().setSteamGamesBlock().run()
            },
          },
        }
      },
      getBubbleMenu() {
        return {
          pluginKey: 'steam-games-block-bubble-menu',
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, SteamGamesBlockExtension.name)
          },
          items: [
            {
              priority: 50,
              component: markRaw(BlockActionSeparator),
            },
            {
              priority: 60,
              props: {
                icon: markRaw(RiDeleteBinLine),
                title: '删除',
                action: ({ editor }: { editor: Editor }) => {
                  deleteNode(SteamGamesBlockExtension.name, editor)
                },
              },
            },
          ],
        }
      },
    }
  },
})

export default SteamGamesBlockExtension
