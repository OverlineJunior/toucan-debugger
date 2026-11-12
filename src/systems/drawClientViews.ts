import {
	Builtin,
	component,
	type Entity,
	type EntityLike,
	pair,
	query,
	type RawId,
} from '@rbxts/toucan'
import { describeEntity } from '../descriptor'
import type { Theme } from '../themes'
import { ClientEntityList } from '../ui/explorer/entityList'
import entityView, { NoView } from '../ui/explorer/entityView'
import { type EntityInstance, Frame, ScrollingFrame } from '../util/instance'
import { RuntimeLabelFor } from './updateRuntimeLabel'

export const ClientViewFor = component('ClientViewFor')

const seen = new Set<RawId>()

function canPlaceView(e: EntityLike): boolean {
	return !e.has(NoView) && !seen.has(e.id)
}

/** Draws client-side entity views into the client list. */
export function drawClientViews(theme: Theme): void {
	const placeViewsDeep = (
		e: EntityLike,
		[parentEntt, parentInst]: EntityInstance,
		order: number,
	) => {
		const view = entityView(describeEntity(e), theme)
		const [viewEntt, viewInst] = view.root
		viewEntt.set(pair(Builtin.ChildOf, parentEntt))
		viewEntt.set(pair(ClientViewFor, e))
		viewInst.Parent = parentInst
		viewInst.LayoutOrder = order
		seen.add(e.id)

		if (view.header.runtimeLabel) {
			view.header.runtimeLabel[0].set(pair(RuntimeLabelFor, e))
		}

		e.children()
			.filter((c) => canPlaceView(c))
			.forEach((c, index) =>
				placeViewsDeep(c, [viewEntt, view.body.root[1]], index),
			)
	}

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(ClientEntityList)
		.collect()[0]

	const enttKinds = [Builtin.Entity, Builtin.Component, Builtin.Resource]
	enttKinds.forEach((enttKind) => {
		let index = 0
		query(enttKind)
			.filter((e) => canPlaceView(e) && e.parent() === undefined)
			.forEach((e) => {
				placeViewsDeep(e, [containerEntt as Entity, containerInst], index++)
			})
	})
}

/** Cleans up client views when their target entity despawns. */
export function bindClientViewCleanup(): void {
	ClientViewFor.onRemoved((view, _v, despawned) => {
		if (despawned) return

		const frame = view.get(Frame)
		if (!frame) return

		frame.Destroy()
		view.despawn()
	})
}
