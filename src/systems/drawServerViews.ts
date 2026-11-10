import { Builtin, component, pair, query, type RawId } from '@rbxts/toucan'
import {
	consumeSnapshotDirty,
	getActiveEnv,
	getServerSnapshot,
} from '../state/explorer'
import type { Theme } from '../themes'
import { ServerEntityList } from '../ui/explorer/entityList'
import entityView, { type EntityView } from '../ui/explorer/entityView'
import { Frame, ScrollingFrame } from '../util/instance'

export const ServerView = component('ServerView')

/** Rebuilds the server list from the latest snapshot when it is dirty. */
export function drawServerViews(theme: Theme): void {
	if (getActiveEnv() !== 'server' || !consumeSnapshotDirty()) return

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(ServerEntityList)
		.collect()[0]

	query(ServerView).forEach((e) => e.despawn())

	const views = new Map<RawId, EntityView>()
	const snapshot = getServerSnapshot()

	snapshot.forEach((node, index) => {
		const view = entityView(node, theme)
		const [viewEntt, viewInst] = view.root
		const parent =
			node.parentId !== undefined ? views.get(node.parentId) : undefined

		if (parent) {
			viewEntt.set(pair(Builtin.ChildOf, parent.root[0]))
			viewInst.Parent = parent.body[1]
		} else {
			viewEntt.set(pair(Builtin.ChildOf, containerEntt))
			viewInst.Parent = containerInst
		}

		viewEntt.set(ServerView)
		viewInst.LayoutOrder = index
		views.set(node.id, view)
	})
}

/** Destroys server view frames when their view entity is removed. */
export function bindServerViewCleanup(): void {
	ServerView.onRemoved((view, _v, despawned) => {
		const frame = view.get(Frame)
		if (frame) frame.Destroy()
		if (!despawned) view.despawn()
	})
}
