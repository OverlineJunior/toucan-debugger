import { Builtin, type EntityLike, type RawId } from '@rbxts/toucan'

export type EntityKind =
	| 'entity'
	| 'component'
	| 'resource'
	| 'system'
	| 'schedule'
	| 'plugin'

export interface EntityDescriptor {
	id: RawId
	label: string
	kind: EntityKind
	runtimeMs?: number
	components?: string[]
	relationships?: string[]
}

/** Returns the debugger kind for an entity-like value. */
export function getEntityKind(e: EntityLike): EntityKind {
	if (e.has(Builtin.Component)) return 'component'
	if (e.has(Builtin.Resource)) return 'resource'
	if (e.has(Builtin.System)) return 'system'
	if (e.has(Builtin.Schedule)) return 'schedule'
	if (e.has(Builtin.Plugin)) return 'plugin'
	return 'entity'
}

/** Builds a serializable descriptor for an entity-like value. */
export function describeEntity(e: EntityLike): EntityDescriptor {
	return {
		id: e.id,
		label: e.toString(),
		kind: getEntityKind(e),
		components: e.components().map((c) => c.toString()),
		relationships: e
			.relationships()
			// ChildOf is already rendered as the entity tree.
			.filter((p) => p.relation.id !== Builtin.ChildOf.id)
			.map((p) => `(${p.relation}, ${p.target})`),
	}
}
