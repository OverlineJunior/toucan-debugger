import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { updateCollapsible } from './collapsible'
import { bindEntityViewCleanup, drawEntityEntries } from './drawEntityEntries'
import { type ServerSnapshot, snapshotEvent } from './snapshot'
import { type Theme, themes } from './themes'
import explorerPanel from './ui'
import { updateRuntimeLabel } from './updateRuntimeLabel'

let serverSnapshot: ServerSnapshot = []
let snapshotDirty = false

export function getServerSnapshot(): ServerSnapshot {
	return serverSnapshot
}

export function consumeSnapshotDirty(): boolean {
	const dirty = snapshotDirty
	snapshotDirty = false
	return dirty
}

function setupDebuggerPanel(parent: Instance, theme: Theme) {
	explorerPanel(parent, theme)
}

export function bindServerSnapshot(): void {
	snapshotEvent.OnClientEvent.Connect((snapshot) => {
		serverSnapshot = snapshot
		snapshotDirty = true
		print(
			'[toucan-debugger] received server snapshot',
			snapshot.size(),
			snapshot,
		)
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
		.useSystem('preStartup', bindEntityViewCleanup)
		.useSystem('preStartup', bindServerSnapshot)
		.useSystemChain('last', [
			[drawEntityEntries, { args: [theme] }],
			[updateCollapsible, { args: [theme] }],
			updateRuntimeLabel,
		])
}
