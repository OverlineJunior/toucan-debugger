import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import { updateCollapsible } from './collapsible'
import { bindEntityEntryCleanup, drawEntityEntries } from './drawEntityEntries'
import type { Theme } from './themes'
import explorerPanel from './ui'
import { updateRuntimeLabel } from './updateRuntimeLabel'

export { type Theme, themes } from './themes'

function setupDebuggerPanel(parent: Instance, theme: Theme) {
	explorerPanel(parent, theme)
}

export default function toucanDebugger(scheduler: Scheduler, theme: Theme) {
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
