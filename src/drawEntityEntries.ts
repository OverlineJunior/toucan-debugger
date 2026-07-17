import {
	Builtin,
	component,
	type EntityHandle,
	type Handle,
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

function canPlaceEntry(e: Handle): boolean {
	return !e.has(NoEntry) && !seen.has(e.id)
}

export function drawEntityEntries(theme: Theme): void {
	const placeEntriesDeep = (
		e: Handle,
		[parentEntt, parentInst]: EntityInstance,
	) => {
		const [[entryEntt, entryInst], body] = entityEntry(e, theme)
        entryEntt.set(pair(Builtin.ChildOf, parentEntt))
		entryEntt.set(pair(EntryFor, e as EntityHandle))
		entryInst.Parent = parentInst
		seen.add(e.id)

		e.children()
			.filter((c) => canPlaceEntry(c))
			.forEach((c) => placeEntriesDeep(c, [entryEntt, body]))
	}

	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(EntityList)
		.collect()[0]

	query(Builtin.Wildcard)
		.filter((e) => canPlaceEntry(e) && e.parent() === undefined)
		.forEach((e) =>
			placeEntriesDeep(e, [containerEntt as EntityHandle, containerInst]),
		)
}

export function bindEntityEntryCleanup(): void {
    query(Frame).onRemoved(EntryFor, (entryEntt, frame) => {
        frame.Destroy()
        // TODO: despawning (and possibly other world mutations) an entity inside of an observer callback that's observing it causes a crash.
        task.defer(() => entryEntt.despawn())
    })
}
