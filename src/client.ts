import { Players, RunService, UserInputService } from '@rbxts/services'
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
	/** Theme used for the debugger UI. Defaults to `themes.dark`. */
	theme?: Theme
	/** Keybind used to toggle the debugger panel's visibility. */
	toggleKeybind: Enum.KeyCode
}

function setupDebuggerPanel(
	parent: Instance,
	theme: Theme,
	toggleKeybind?: Enum.KeyCode,
) {
    const [, screenGui] = explorerPanel(parent, theme)
    screenGui.Enabled = false

	UserInputService.InputBegan.Connect((input, ui) => {
		if (ui || input.KeyCode !== toggleKeybind) return

		screenGui.Enabled = !screenGui.Enabled
	})
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
 * // Passing a theme is optional — defaults to dark.
 * scheduler().usePlugin(toucanDebuggerClient, {
 *     toggleKeybind: Enum.KeyCode.F4,
 *     theme: themes.black,
 * }).run()
 * ```
 */
export function toucanDebuggerClient(
	scheduler: Scheduler,
	options: ClientDebuggerOptions,
): void {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const theme = options.theme ?? themes.dark
	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

	scheduler
		.useSystem('preStartup', setupDebuggerPanel, {
			args: [playerGui, theme, options.toggleKeybind],
		})
		.useSystem('preStartup', bindEntityViewCleanup)
		.useSystem('preStartup', bindReceiveServerSnapshot)
		.useSystemChain('last', [
			[drawClientViews, { args: [theme] }],
			[drawServerViews, { args: [theme] }],
			[updateCollapsible, { args: [theme] }],
		])
}
