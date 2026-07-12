import { Builtin, type Handle, query } from '@rbxts/toucan'
import { DebuggerPanel } from './ui'
import type { Collapsible } from './ui/collapsible'
import entityEntry from './ui/entityEntry'

const entries = new Map<number, Collapsible>()

function placeEntry(
	e: Handle,
	entries: Map<number, Collapsible>,
	container: Instance,
	depth: number,
): void {
	const entry = entries.get(e.id)!
	entry.root.Parent = container
	entry.setDepth(depth)

	e.children().forEach((child) => {
		const childEntry = entries.get(child.id)
		if (childEntry === undefined) return // child filtered out (internal/third-party)
		placeEntry(child, entries, entry.body, depth + 1)
	})
}

export default function drawEntities(): void {
	const [, panel] = query(DebuggerPanel).collect()[0]

	const aliveEntities: Handle[] = []
	const aliveIds = new Set<number>()

	query(Builtin.Wildcard)
		.without(Builtin.Internal, Builtin.ThirdParty)
		.forEach((e) => {
			aliveEntities.push(e)
			aliveIds.add(e.id)
		})

	// Remove entries for entities that are no longer alive (despawned)
	entries.forEach((entry, id) => {
		if (!aliveIds.has(id)) {
			entry.root.Destroy()
			entries.delete(id)
		}
	})

	// Create entries for newly spawned entities (before placement so the
	// body container exists when children are parented into it)
	aliveEntities.forEach((e) => {
		if (!entries.has(e.id)) {
			entries.set(e.id, entityEntry(e, []))
		}
	})

	// Detach all roots from the panel so we can re-parent cleanly.
	// Children are re-attached inside placeEntry via entry.body.
	entries.forEach((entry) => {
		entry.root.Parent = undefined
	})

	// Find root entities (no parent, or parent filtered out) and place
	// the tree recursively — same logic as hierarchyTest
	aliveEntities.forEach((e) => {
		const parentHandle = e.parent()
		const isRoot = parentHandle === undefined || !aliveIds.has(parentHandle.id)
		if (isRoot) {
			placeEntry(e, entries, panel.entityContents, 0)
		}
	})

	// Disable the chevron for leaf nodes (entities with no visible children)
	entries.forEach((entry, id) => {
		const handle = aliveEntities.find((e) => e.id === id)
		if (handle === undefined) return
		const hasVisibleChildren = handle
			.children()
			.some((child) => aliveIds.has(child.id))
		entry.setDisabled(!hasVisibleChildren)
	})
}
