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
import entityEntry, { NoEntry } from './ui/explorer/entityEntry'
import { EntityList } from './ui/explorer/entityList'

export const EntryFor = component('EntryFor')

const seen = new Set<RawId>()

function canPlaceEntry(e: EntityLike): boolean {
	return !e.has(NoEntry) && !seen.has(e.id)
}

export function drawEntityEntries(theme: Theme): void {
	const placeEntriesDeep = (
		e: EntityLike,
		[parentEntt, parentInst]: EntityInstance,
	) => {
		const [[entryEntt, entryInst], body] = entityEntry(e, theme)
		entryEntt.set(pair(Builtin.ChildOf, parentEntt))
		entryEntt.set(pair(EntryFor, e))
		entryInst.Parent = parentInst
		seen.add(e.id)

		e.children()
			.filter((c) => canPlaceEntry(c))
			.forEach((c) => placeEntriesDeep(c, [entryEntt, body]))
	}

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(EntityList)
		.collect()[0]

	const enttKinds = [Builtin.Entity, Builtin.Component, Builtin.Resource]
	enttKinds.forEach((enttKind) => {
		query(enttKind)
			.filter((e) => canPlaceEntry(e) && e.parent() === undefined)
			.forEach((e) =>
				placeEntriesDeep(e, [containerEntt as Entity, containerInst]),
			)
	})
}

export function bindEntityEntryCleanup(): void {
	EntryFor.onRemoved((entry, _v, despawned) => {
		if (despawned) return

		const frame = entry.get(Frame)
		if (!frame) return

		frame.Destroy()
		entry.despawn()
	})
}
