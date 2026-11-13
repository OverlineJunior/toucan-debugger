import { component, type Entity } from '@rbxts/toucan'
import type { EntityDescriptor } from '../../../descriptor'
import { Collapsible } from '../../../systems/collapsible'
import type { Theme } from '../../../themes'
import { type EntityInstance, entityFor } from '../../../util/instance'
import { type EntityViewBody, makeBody } from './body'
import { drawEntityDetails, NoView } from './body/details'
import { type EntityViewHeader, makeHeader } from './header'

export type { EntityViewBody } from './body'
export { drawEntityDetails, NoView } from './body/details'
export { getEntityIcon } from './header'

export const EntityView = component('EntityView')

export interface EntityView {
	root: EntityInstance<Frame>
	header: EntityViewHeader
	body: EntityViewBody
}

/** Builds a collapsible view for an entity descriptor. */
export default function entityView(
	descriptor: EntityDescriptor,
	theme: Theme,
): EntityView {
	const header = makeHeader(descriptor, theme)
	const body = makeBody(theme)

	const root = entityFor('Frame', {
		Name: `entityView: ${descriptor.label}`,
		Size: UDim2.fromScale(0, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		Transparency: 1,
		LayoutOrder: descriptor.id,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Vertical,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			header.root,
			body.root,
		],
	})

	root[0].set(Collapsible, {
		toggleButton: header.root[1],
		chevron: header.chevron[1],
		body: body.root[1],
		hasChildren: () => root[0].children().some((c) => c.has(EntityView)),
	})

	const result: EntityView = { root, header, body }

	drawEntityDetails(result, descriptor, theme)

	// Without this, `drawEntities` would add views infinitely, crashing the game.
	const addNoViewRecursive = (e: Entity) => {
		e.set(NoView)
		e.children().forEach((c) => addNoViewRecursive(c as Entity))
	}
	addNoViewRecursive(root[0])

	return result
}
