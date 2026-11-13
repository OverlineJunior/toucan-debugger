import { query, type RawId } from '@rbxts/toucan'
import {
	consumeSnapshotDirty,
	getActiveEnv,
	getServerSnapshot,
} from '../state/explorer'
import type { Theme } from '../themes'
import { ServerEntityList } from '../ui/explorer/entityList'
import type { EntityView } from '../ui/explorer/entityView'
import { syncEntityViews } from '../ui/explorer/viewSync'
import { ScrollingFrame } from '../util/instance'

// Persists server views across snapshots so collapsible's expansion state survives refreshes.
const views = new Map<RawId, EntityView>()

/** Syncs the server list with the latest snapshot when it is dirty. */
export function drawServerViews(theme: Theme): void {
	if (getActiveEnv() !== 'server' || !consumeSnapshotDirty()) return

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(ServerEntityList)
		.collect()[0]

	syncEntityViews(
		views,
		getServerSnapshot(),
		containerEntt,
		containerInst,
		theme,
	)
}
