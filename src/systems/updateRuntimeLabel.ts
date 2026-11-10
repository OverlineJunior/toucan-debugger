import { Builtin, component, pair, query } from '@rbxts/toucan'
import { formatMs } from '../util/format'
import { TextLabel } from '../util/instance'

const UPDATE_INTERVAL = 0.5

export const RuntimeLabelFor = component('RuntimeLabelFor')

let lastRun = 0

export function updateRuntimeLabel() {
	const now = os.clock()
	// TODO: use something like `useThrottle` once its plugin gets published.
	if (now - lastRun < UPDATE_INTERVAL) return
	lastRun = now

	query(TextLabel)
		.with(pair(RuntimeLabelFor, Builtin.Wildcard))
		.forEach((e, label) => {
			const systemEntt = e.targetOf(RuntimeLabelFor)!
			const system = systemEntt.get(Builtin.System)!
			label.Text = formatMs(system.runtimeMs)
		})
}
