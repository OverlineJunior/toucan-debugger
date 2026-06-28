import { Players, RunService } from '@rbxts/services'
import type { Scheduler } from '@rbxts/toucan'
import debuggerPanel from './debugger'

function setupDebuggerPanel(parent: Instance) {
	const _panel = debuggerPanel(parent)
}

export default function toucanDebugger(scheduler: Scheduler) {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

	scheduler.useSystem('preStartup', setupDebuggerPanel, { args: [playerGui] })
}
