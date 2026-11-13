import { Builtin, type EntityLike, query, type RawId } from '@rbxts/toucan'

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

export interface EntityNode extends EntityDescriptor {
	parentId?: RawId
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
	const kind = getEntityKind(e)
	return {
		id: e.id,
		label: e.toString(),
		kind,
		runtimeMs: kind === 'system' ? e.get(Builtin.System)?.runtimeMs : undefined,
		components: e.components().map((c) => c.toString()),
		relationships: e.relationships().map((p) => `(${p.relation}, ${p.target})`),
	}
}

/**
 * Collects every entity as a flat list of descriptors.
 *
 * Parent-child hierarchy is represented by EntityNode's parentId.
 */
export function collectEntityNodes(
	shouldInclude?: (e: EntityLike) => boolean,
): EntityNode[] {
	const nodes: EntityNode[] = []
	const seen = new Set<RawId>()

	const visit = (e: EntityLike, parentId?: RawId) => {
		if (seen.has(e.id) || (shouldInclude && !shouldInclude(e))) return
		seen.add(e.id)

		nodes.push({ ...describeEntity(e), parentId })

		for (const child of e.children()) {
			visit(child, e.id)
		}
	}

	const kinds = [Builtin.Entity, Builtin.Component, Builtin.Resource]
	for (const kind of kinds) {
		query(kind)
			.filter((e) => e.parent() === undefined)
			.forEach((e) => visit(e))
	}

	return nodes
}
