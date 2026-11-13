import { query, type RawId } from '@rbxts/toucan'
import { collectEntityNodes } from '../descriptor'
import { getActiveEnv } from '../state/explorer'
import type { Theme } from '../themes'
import { ClientEntityList } from '../ui/explorer/entityList'
import { type EntityView, NoView } from '../ui/explorer/entityView'
import { syncEntityViews } from '../ui/explorer/viewSync'
import { ScrollingFrame } from '../util/instance'

const UPDATE_INTERVAL = 0.25

// Persists client views across frames so collapsible state and details update in place.
const views = new Map<RawId, EntityView>()

let lastRun = -UPDATE_INTERVAL

/** Draws client-side entity views into the client list. */
export function drawClientViews(theme: Theme): void {
	if (getActiveEnv() !== 'client') return

	const now = os.clock()
	if (now - lastRun < UPDATE_INTERVAL) return
	lastRun = now

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(ClientEntityList)
		.collect()[0]

	const nodes = collectEntityNodes((e) => !e.has(NoView))
	syncEntityViews(views, nodes, containerEntt, containerInst, theme)
}
