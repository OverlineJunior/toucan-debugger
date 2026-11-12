import { Builtin, component, pair, query, type RawId } from '@rbxts/toucan'
import type { ServerNode } from '../snapshot'
import {
	consumeSnapshotDirty,
	getActiveEnv,
	getServerSnapshot,
} from '../state/explorer'
import type { Theme } from '../themes'
import { ServerEntityList } from '../ui/explorer/entityList'
import entityView, {
	drawEntityDetails,
	type EntityView,
	getEntityIcon,
} from '../ui/explorer/entityView'
import { formatMs } from '../util/format'
import { Frame, ScrollingFrame } from '../util/instance'

export const ServerView = component('ServerView')

// Persists server views across snapshots so collapsible's expansion state survives refreshes.
const views = new Map<RawId, EntityView>()

function updateView(view: EntityView, node: ServerNode, theme: Theme): void {
	view.header.icon[1].Image = getEntityIcon(node.kind, theme)
	view.header.label[1].Text = node.label

	if (view.header.runtimeLabel) {
		view.header.runtimeLabel[1].Text =
			node.runtimeMs !== undefined ? formatMs(node.runtimeMs) : '?'
	}

	drawEntityDetails(view, node, theme)
}

/** Syncs the server list with the latest snapshot when it is dirty. */
export function drawServerViews(theme: Theme): void {
	if (getActiveEnv() !== 'server' || !consumeSnapshotDirty()) return

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(ServerEntityList)
		.collect()[0]

	const snapshot = getServerSnapshot()
	const seen = new Set<RawId>()
	for (const node of snapshot) seen.add(node.id)

	snapshot.forEach((node, index) => {
		let view = views.get(node.id)

		if (view) {
			updateView(view, node, theme)
		} else {
			view = entityView(node, theme)
			view.root[0].set(ServerView)
			views.set(node.id, view)
		}

		const [viewEntt, viewInst] = view.root
		const parent =
			node.parentId !== undefined && seen.has(node.parentId)
				? views.get(node.parentId)
				: undefined

		if (parent) {
			viewEntt.set(pair(Builtin.ChildOf, parent.root[0]))
			viewInst.Parent = parent.body.root[1]
		} else {
			viewEntt.set(pair(Builtin.ChildOf, containerEntt))
			viewInst.Parent = containerInst
		}

		viewInst.LayoutOrder = index
	})

	// Despawn views whose entities are no longer in the snapshot.
	for (const [id, view] of views) {
		if (seen.has(id)) continue
		view.root[0].despawn()
		views.delete(id)
	}
}

/** Destroys server view frames when their view entity is removed. */
export function bindServerViewCleanup(): void {
	ServerView.onRemoved((view, _v, despawned) => {
		const frame = view.get(Frame)
		if (frame) frame.Destroy()
		if (!despawned) view.despawn()
	})
}
