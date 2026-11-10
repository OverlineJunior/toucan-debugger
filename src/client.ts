import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { snapshotEvent } from './snapshot'
import { setServerSnapshot } from './state/explorer'
import { updateCollapsible } from './systems/collapsible'
import {
	bindClientViewCleanup,
	drawClientViews,
} from './systems/drawClientViews'
import {
	bindServerViewCleanup,
	drawServerViews,
} from './systems/drawServerViews'
import { updateRuntimeLabel } from './systems/updateRuntimeLabel'
import { type Theme, themes } from './themes'
import explorerPanel from './ui/panel'

function setupDebuggerPanel(parent: Instance, theme: Theme) {
	explorerPanel(parent, theme)
}

/** Subscribes to server snapshot broadcasts and stores the latest one. */
export function bindServerSnapshot(): void {
	snapshotEvent.OnClientEvent.Connect((snapshot) => {
		setServerSnapshot(snapshot)
	})
}

/**
 * Spawns a visual debugger.
 *
 * @remarks
 * Throws if used on the server.
 *
 * @example
 * ```ts
 * import { toucanDebuggerClient, themes } from '@rbxts/toucan-debugger'
 *
 * // Passing a theme is optional — defaults to black.
 * scheduler().usePlugin(toucanDebuggerClient, themes.black).run()
 * ```
 */
export function toucanDebuggerClient(
	scheduler: Scheduler,
	theme = themes.black,
): void {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

	scheduler
		.useSystem('preStartup', setupDebuggerPanel, { args: [playerGui, theme] })
		.useSystem('preStartup', bindClientViewCleanup)
		.useSystem('preStartup', bindServerViewCleanup)
		.useSystem('preStartup', bindServerSnapshot)
		.useSystemChain('last', [
			[drawClientViews, { args: [theme] }],
			[drawServerViews, { args: [theme] }],
			[updateCollapsible, { args: [theme] }],
			updateRuntimeLabel,
		])
}
