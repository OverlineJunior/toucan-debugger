import {
	Builtin,
	component,
	type Entity,
	type EntityLike,
	pair,
	query,
	type RawId,
} from '@rbxts/toucan'
import { type EntityInstance, Frame, ScrollingFrame } from './instance'
import type { Theme } from './themes'
import { EntityList } from './ui/explorer/entityList'
import entityView, { NoView } from './ui/explorer/entityView'

export const ViewFor = component('ViewFor')

const seen = new Set<RawId>()

function canPlaceView(e: EntityLike): boolean {
	return !e.has(NoView) && !seen.has(e.id)
}

export function drawEntityEntries(theme: Theme): void {
	const placeEntriesDeep = (
		e: EntityLike,
		[parentEntt, parentInst]: EntityInstance,
	) => {
		const [[viewEntt, viewInst], body] = entityView(e, theme)
		viewEntt.set(pair(Builtin.ChildOf, parentEntt))
		viewEntt.set(pair(ViewFor, e))
		viewInst.Parent = parentInst
		seen.add(e.id)

		e.children()
			.filter((c) => canPlaceView(c))
			.forEach((c) => placeEntriesDeep(c, [viewEntt, body]))
	}

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(EntityList)
		.collect()[0]

	const enttKinds = [Builtin.Entity, Builtin.Component, Builtin.Resource]
	enttKinds.forEach((enttKind) => {
		query(enttKind)
			.filter((e) => canPlaceView(e) && e.parent() === undefined)
			.forEach((e) =>
				placeEntriesDeep(e, [containerEntt as Entity, containerInst]),
			)
	})
}

export function bindEntityViewCleanup(): void {
	ViewFor.onRemoved((view, _v, despawned) => {
		if (despawned) return

		const frame = view.get(Frame)
		if (!frame) return

		frame.Destroy()
		view.despawn()
	})
}
