import { Builtin, query } from '@rbxts/toucan'
import { DebuggerPanel } from './ui'
import entityEntry from './ui/entityEntry'

// Persists across frames: maps panel entity ID → (entity ID → collapsible root)
const panelEntries = new Map<number, Map<number, ImageButton>>()

export default function drawEntities(): void {
	query(DebuggerPanel).forEach((panelEntity, panel) => {
		// Lazily initialise the entries map for this panel
		if (!panelEntries.has(panelEntity.id)) {
			panelEntries.set(panelEntity.id, new Map())
		}
		const entries = panelEntries.get(panelEntity.id)!

		// Track which entity IDs are alive this frame
		const seen = new Set<number>()

		query(Builtin.Wildcard)
			.without(Builtin.Internal, Builtin.ThirdParty)
			.forEach((e) => {
				seen.add(e.id)

				// Newly spawned entity — create its UI entry
				if (!entries.has(e.id)) {
                    const entry = entityEntry(e, [])
					entry.root.Parent = panel.entityContents
					entries.set(e.id, entry.root)
				}
			})

		// Remove entries for entities that are no longer alive (despawned)
		entries.forEach((root, id) => {
			if (!seen.has(id)) {
				root.Destroy()
				entries.delete(id)
			}
		})
	})
}
