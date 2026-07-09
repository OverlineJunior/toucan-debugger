import { Players, RunService } from '@rbxts/services'
import { Builtin, entity, Handle, query, type Scheduler } from '@rbxts/toucan'
import debuggerPanel, { DebuggerPanel } from './ui'
import drawEntities from './drawEntities'

function hierarchyTest() {
    const printHierarchy = (e: Handle, depth: number, seen: Set<Handle>) => {
        if (seen.has(e)) return // Defensive guard against cycles.
        seen.add(e)
    
        print(`${'  '.rep(depth)}${e.toString()}`)
    
        e.children().forEach((child) => {
            printHierarchy(child, depth + 1, seen)
        })
    }
    
    const displayEntities = query(Builtin.Wildcard).map((e) => e)

    const roots = displayEntities.filter((e) => e.parent() === undefined)

    const seen = new Set<Handle>()
    roots.forEach((e) => printHierarchy(e, 0, seen))
}

function setupDebuggerPanel(parent: Instance) {
    entity('debuggerPanel').set(DebuggerPanel, debuggerPanel(parent))
    hierarchyTest()
}

export default function toucanDebugger(scheduler: Scheduler) {
	if (RunService.IsServer()) {
		error("Toucan's debugger can only be used on the client")
	}

	const client = Players.LocalPlayer
	const playerGui = client.WaitForChild('PlayerGui')

    scheduler.useSystem('preStartup', setupDebuggerPanel, { args: [playerGui] })
    scheduler.useSystem('last', drawEntities)
}
