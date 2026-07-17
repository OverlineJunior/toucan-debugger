import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import explorerPanel from './ui'
import type { Theme } from './themes'
import { bindEntityEntryCleanup, drawEntityEntries } from './drawEntityEntries'
import { updateCollapsible } from './collapsible'
import { updateRuntimeLabel } from './updateRuntimeLabel'

export { themes, type Theme } from './themes'

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
