import {
	Builtin,
	component,
	type Entity,
	type EntityLike,
	pair,
	query,
} from '@rbxts/toucan'
import type { EntityDescriptor } from '../../../../descriptor'
import type { Theme } from '../../../../themes'
import { type EntityInstance, entityFor } from '../../../../util/instance'
import type { EntityView } from '..'

export const NoView = component('NoView')
const DetailSectionTitleFor = component<TextLabel>('DetailSectionTitleFor')
const DetailItemFor = component<TextLabel>('DetailItemFor')

export function makeDetailContainer(theme: Theme): EntityInstance<Frame> {
	return entityFor('Frame', {
		Name: 'detailContainer',
		Size: UDim2.fromScale(1, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		Transparency: 1,
		Visible: false,
		LayoutOrder: 1e6,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Vertical,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.small,
			}),
		],
	})
}

function makeDetailSectionTitle(
	text: string,
	view: Entity,
	parent: EntityInstance<Frame>,
	theme: Theme,
): EntityInstance<TextLabel> {
	const section = entityFor('TextLabel', {
		Name: `section`,
		Text: text,
		FontFace: theme.fonts.bold,
		TextSize: theme.fontSizes.tiny,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextColor3: theme.colors.contentMuted,
		Size: new UDim2(1, 0, 0, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		BackgroundTransparency: 1,
		Parent: parent[1],
	})

	section[0]
		.set(pair(DetailSectionTitleFor, view), section[1])
		.set(pair(Builtin.ChildOf, parent[0]))
		.set(NoView)

	return section
}

function makeDetailItem(
	text: string,
	view: Entity,
	parent: EntityInstance<Frame>,
	theme: Theme,
): EntityInstance<TextLabel> {
	const detail = entityFor('TextLabel', {
		Name: 'detail',
		Text: text,
		FontFace: theme.fonts.regular,
		TextSize: theme.fontSizes.small,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextColor3: theme.colors.content,
		Size: new UDim2(1, 0, 0, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		TextWrapped: true,
		BackgroundTransparency: 1,
		Parent: parent[1],
	})

	detail[0]
		.set(pair(DetailItemFor, view), detail[1])
		.set(pair(Builtin.ChildOf, parent[0]))
		.set(NoView)

	return detail
}

/** Rebuilds the components and relationships sections of an entity view. */
export function drawEntityDetails(
	view: EntityView,
	descriptor: EntityDescriptor,
	theme: Theme,
): void {
	const components = descriptor.components ?? []
	const relationships = descriptor.relationships ?? []
	// \x00 separates items and \x01 separates the two lists,
	// so ["Player", "Health"] and ["PlayerHealth"] produce different fingerprints.
	const signature = `${components.join('\x00')}\x01${relationships.join('\x00')}`

	if (view.body.detailsSignature === signature) return
	view.body.detailsSignature = signature

	const remove = (e: EntityLike, inst: Instance) => {
		e.despawn()
		inst.Destroy()
	}
	query(pair(DetailSectionTitleFor, view.root[0])).forEach(remove)
	query(pair(DetailItemFor, view.root[0])).forEach(remove)

	if (components.size() > 0) {
		makeDetailSectionTitle('Components', view.root[0], view.body.details, theme)
		components.forEach((text) =>
			makeDetailItem(text, view.root[0], view.body.details, theme),
		)
	}

	if (relationships.size() > 0) {
		makeDetailSectionTitle(
			'Relationships',
			view.root[0],
			view.body.details,
			theme,
		)
		relationships.forEach((text) =>
			makeDetailItem(text, view.root[0], view.body.details, theme),
		)
	}

	view.body.details[1].Visible =
		components.size() > 0 || relationships.size() > 0
}
