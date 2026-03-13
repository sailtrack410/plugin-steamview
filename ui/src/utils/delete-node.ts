import type { Editor } from '@halo-dev/richtext-editor'

export const deleteNode = (nodeType: string, editor: Editor) => {
  const { state } = editor
  const $pos = state.selection.$anchor

  if ($pos.depth) {
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
      const node = $pos.node(depth)
      if (node.type.name === nodeType) {
        // @ts-ignore dispatchTransaction exists on current editor runtime
        if (editor.dispatchTransaction) {
          // @ts-ignore dispatchTransaction exists on current editor runtime
          editor.dispatchTransaction(state.tr.delete($pos.before(depth), $pos.after(depth)).scrollIntoView())
          return true
        }
      }
    }
  }

  // @ts-ignore selection.node exists for node selection
  const selectedNode = state.selection.node
  if (selectedNode && selectedNode.type.name === nodeType) {
    editor.chain().deleteSelection().run()
    return true
  }

  return false
}
