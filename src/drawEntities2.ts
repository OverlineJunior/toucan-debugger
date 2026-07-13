import { Builtin, query, type RawId } from '@rbxts/toucan'
import { type EntityInstance, ScrollingFrame } from './instance'
import type { Theme } from './themes'
import entityEntry, { NoEntry } from './ui2/explorer/entityEntry'
import { EntityList } from './ui2/explorer/entityList'

const entries = new Map<RawId, EntityInstance>()

export default function drawEntityEntries(theme: Theme): void {
	const [containerEntt, containerInst] = query(ScrollingFrame)
		.with(EntityList)
		.collect()[0]

	query(Builtin.Wildcard).forEach((e) => {
		if (entries.has(e.id) || e.has(NoEntry)) return
		const entry = entityEntry(e, containerEntt, containerInst, theme)
		entries.set(e.id, entry)
	})
}
