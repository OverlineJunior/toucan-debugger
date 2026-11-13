import { Builtin, type EntityLike, pair, type RawId } from '@rbxts/toucan'
import type { EntityNode } from '../../../descriptor'
import type { Theme } from '../../../themes'
import { formatMs } from '../../../util/format'
import { Frame } from '../../../util/instance'
import entityView, {
	drawEntityDetails,
	EntityView,
	getEntityIcon,
} from '../entityView'

function updateView(view: EntityView, node: EntityNode, theme: Theme): void {
	const icon = getEntityIcon(node.kind, theme)
	if (view.header.icon[1].Image !== icon) {
		view.header.icon[1].Image = icon
	}

	if (view.header.label[1].Text !== node.label) {
		view.header.label[1].Text = node.label
	}

	if (view.header.runtimeLabel) {
		const text = node.runtimeMs !== undefined ? formatMs(node.runtimeMs) : '?'
		if (view.header.runtimeLabel[1].Text !== text) {
			view.header.runtimeLabel[1].Text = text
		}
	}

	drawEntityDetails(view, node, theme)
}

/** Syncs a view map and UI container with a flat list of entity nodes. */
export function syncEntityViews(
	views: Map<RawId, EntityView>,
	nodes: EntityNode[],
	containerEntt: EntityLike,
	containerInst: Instance,
	theme: Theme,
): void {
	const seen = new Set<RawId>()
	for (const node of nodes) seen.add(node.id)

	nodes.forEach((node) => {
		let view = views.get(node.id)

		if (view) {
			updateView(view, node, theme)
		} else {
			view = entityView(node, theme)
			view.root[0].set(EntityView)
			views.set(node.id, view)
		}

		const [viewEntt, viewInst] = view.root
		const parentView =
			node.parentId !== undefined && seen.has(node.parentId)
				? views.get(node.parentId)
				: undefined

		const parentEntt = parentView ? parentView.root[0] : containerEntt
		const parentInst = parentView ? parentView.body.root[1] : containerInst

		if (viewEntt.parent()?.id !== parentEntt.id) {
			viewEntt.set(pair(Builtin.ChildOf, parentEntt))
		}
		if (viewInst.Parent !== parentInst) {
			viewInst.Parent = parentInst
		}
	})

	// Despawn views whose entities are no longer reachable.
	for (const [id, view] of views) {
		if (seen.has(id)) continue
		if (view.root[0].exists()) {
			view.root[0].despawn()
		}
		views.delete(id)
	}
}

/** Destroys entity view frames when their view entity is removed. */
export function bindEntityViewCleanup(): void {
	EntityView.onRemoved((view, _v, despawned) => {
		const frame = view.get(Frame)
		if (frame) frame.Destroy()
		if (!despawned) view.despawn()
	})
}
