import { event } from '@rbxts/link'
import { Builtin, type EntityLike, query, type RawId } from '@rbxts/toucan'
import { describeEntity, type EntityDescriptor } from './descriptor'

export interface ServerNode extends EntityDescriptor {
	parentId?: RawId
}

export type ServerSnapshot = ServerNode[]

export const snapshotEvent = event<[ServerSnapshot]>()

/** Collects the server entity tree as a flat snapshot. */
export function collectServerSnapshot(): ServerSnapshot {
	const snapshot: ServerSnapshot = []
	const seen = new Set<number>()

	const visit = (e: EntityLike, parentId?: RawId) => {
		if (seen.has(e.id)) return
		seen.add(e.id)

		const descriptor = describeEntity(e)
		if (descriptor.kind === 'system') {
			const system = e.get(Builtin.System)
			if (system) descriptor.runtimeMs = system.runtimeMs
		}

		snapshot.push({ ...descriptor, parentId })

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
