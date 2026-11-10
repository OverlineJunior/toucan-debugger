import { event } from '@rbxts/link'
import { Builtin, type EntityLike, query } from '@rbxts/toucan'

export type EntityKind =
	| 'entity'
	| 'component'
	| 'resource'
	| 'system'
	| 'schedule'
	| 'plugin'

export interface EntityDescriptor {
	id: number
	label: string
	kind: EntityKind
	runtimeMs?: number
}

export interface ServerNode extends EntityDescriptor {
	parentId?: number
}

export type ServerSnapshot = ServerNode[]

export const snapshotEvent = event<[ServerSnapshot]>()

export function getEntityKind(e: EntityLike): EntityKind {
	if (e.has(Builtin.Component)) return 'component'
	if (e.has(Builtin.Resource)) return 'resource'
	if (e.has(Builtin.System)) return 'system'
	if (e.has(Builtin.Schedule)) return 'schedule'
	if (e.has(Builtin.Plugin)) return 'plugin'
	return 'entity'
}

export function describeEntity(e: EntityLike): EntityDescriptor {
	const kind = getEntityKind(e)
	const descriptor: EntityDescriptor = {
		id: e.id,
		label: e.toString(),
		kind,
	}

	if (kind === 'system') {
		const system = e.get(Builtin.System)
		if (system) descriptor.runtimeMs = system.runtimeMs
	}

	return descriptor
}

export function collectServerSnapshot(): ServerSnapshot {
	const snapshot: ServerSnapshot = []
	const seen = new Set<number>()

	const visit = (e: EntityLike, parentId?: number) => {
		if (seen.has(e.id)) return
		seen.add(e.id)

		snapshot.push({ ...describeEntity(e), parentId })

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

	return snapshot
}
