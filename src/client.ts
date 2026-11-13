import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { sendServerSnapshot } from './remotes'
import { setServerSnapshot } from './state/explorer'
import { updateCollapsible } from './systems/collapsible'
import { drawClientViews } from './systems/drawClientViews'
import { drawServerViews } from './systems/drawServerViews'
import { type Theme, themes } from './themes'
import { bindEntityViewCleanup } from './ui/explorer/entityView/viewSync'
import explorerPanel from './ui/panel'

export interface ClientDebuggerOptions {
    theme: Theme
}

function setupDebuggerPanel(parent: Instance, theme: Theme) {
	explorerPanel(parent, theme)
}

/** Subscribes to server snapshot broadcasts and stores the latest one. */
export function bindReceiveServerSnapshot(): void {
	sendServerSnapshot.OnClientEvent.Connect((snapshot) => {
		setServerSnapshot(snapshot)
	})
}

/**
 * Spawns a visual debugger.
 *
 * @remarks
 * - Throws if used on the server.
 * - Yields if server plugin not added.
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
	options: ClientDebuggerOptions,
): void {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

	scheduler
		.useSystem('preStartup', setupDebuggerPanel, { args: [playerGui, options.theme] })
		.useSystem('preStartup', bindEntityViewCleanup)
		.useSystem('preStartup', bindReceiveServerSnapshot)
		.useSystemChain('last', [
			[drawClientViews, { args: [options.theme] }],
			[drawServerViews, { args: [options.theme] }],
			[updateCollapsible, { args: [options.theme] }],
		])
}
