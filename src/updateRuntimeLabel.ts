import { Builtin, component, pair, query } from '@rbxts/toucan'
import { TextLabel } from './instance'

const UPDATE_INTERVAL = 0.5

export const RuntimeLabelFor = component('RuntimeLabelFor')

let lastRun = 0

function formatRuntime(ms: number): string {
	if (ms >= 1) return `${math.round(ms * 10) / 10}ms`

	const us = ms * 1000
	const usRounded = math.round(us * 10) / 10
	const showDecimal = usRounded < 10
	return showDecimal ? `${usRounded}µs` : `${math.round(us)}µs`
}

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
			const ms = system.runtimeMs
			label.Text = formatRuntime(system.runtimeMs)
		})
}
