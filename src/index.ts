import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { updateCollapsible } from './collapsible'
import { bindEntityEntryCleanup, drawEntityEntries } from './drawEntityEntries'
import { type Theme, themes } from './themes'
import explorerPanel from './ui'
import { updateRuntimeLabel } from './updateRuntimeLabel'

export { type Theme, themes } from './themes'

function setupDebuggerPanel(parent: Instance, theme: Theme) {
	explorerPanel(parent, theme)
}

/**
 * Spawns a visual debugger.
 *
 * @remarks
 * Throws if used on the server.
 *
 * @example
 * ```ts
 * import toucanDebugger, { themes } from '@rbxts/toucan-debugger'
 *
 * // Passing a theme is optional — defaults to black.
 * scheduler().usePlugin(toucanDebugger, themes.black).run()
 * ```
 */
export default function toucanDebugger(
	scheduler: Scheduler,
	theme = themes.black,
) {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

	scheduler
		.useSystem('preStartup', setupDebuggerPanel, { args: [playerGui, theme] })
		.useSystem('preStartup', bindEntityEntryCleanup)
		.useSystemChain('last', [
			[drawEntityEntries, { args: [theme] }],
			[updateCollapsible, { args: [theme] }],
			updateRuntimeLabel,
		])
}
