import {
	Builtin,
	component,
	type Entity,
	type EntityLike,
	pair,
	query,
} from '@rbxts/toucan'
import type { EntityDescriptor, EntityKind } from '../../descriptor'
import { Collapsible } from '../../systems/collapsible'
import type { Theme } from '../../themes'
import { formatMs } from '../../util/format'
import { type EntityInstance, entityFor } from '../../util/instance'

const HEADER_HEIGHT = 20

export const NoView = component('NoView')
const DetailSectionTitleFor = component<TextLabel>('DetailSectionTitleFor')
const DetailItemFor = component<TextLabel>('DetailItemFor')

export interface EntityView {
	root: EntityInstance<Frame>
	header: EntityViewHeader
	body: EntityViewBody
}

interface EntityViewHeader {
	root: EntityInstance<ImageButton>
	icon: EntityInstance<ImageLabel>
	id: EntityInstance<TextLabel>
	label: EntityInstance<TextLabel>
	runtimeLabel?: EntityInstance<TextLabel>
	chevron: EntityInstance<ImageLabel>
}

export interface EntityViewBody {
	root: EntityInstance<Frame>
	details: EntityInstance<Frame>
	// Used for cheaper equality check between two entity views' details.
	detailsSignature: string
}

export function getEntityIcon(kind: EntityKind, theme: Theme): string {
	if (kind === 'component') return theme.icons.component
	if (kind === 'system') return theme.icons.system
	if (kind === 'schedule') return theme.icons.schedule
	if (kind === 'plugin') return theme.icons.plugin
	return theme.icons.entity
}

function makeHeader(
	descriptor: EntityDescriptor,
	theme: Theme,
): EntityViewHeader {
	const icon = entityFor('ImageLabel', {
		Name: 'icon',
		Image: getEntityIcon(descriptor.kind, theme),
		ImageColor3: theme.colors.contentMuted,
		Size: UDim2.fromScale(0, 1),
		BackgroundTransparency: 1,
		LayoutOrder: 0,

		child: entityFor('UIAspectRatioConstraint', {
			AspectType: Enum.AspectType.ScaleWithParentSize,
			DominantAxis: Enum.DominantAxis.Height,
		}),
	})

	const id = entityFor('TextLabel', {
		Name: 'id',
		Text: `#${descriptor.id}`,
		FontFace: theme.fonts.regular,
		TextSize: theme.fontSizes.small,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextColor3: theme.colors.contentMuted,
		Size: new UDim2(0, 33.5, 1, 0),
		BackgroundTransparency: 1,
		LayoutOrder: 1,
	})

	const label = entityFor('TextLabel', {
		Name: 'label',
		Text: descriptor.label,
		FontFace: theme.fonts.regular,
		TextSize: theme.fontSizes.small,
		TextXAlignment: Enum.TextXAlignment.Left,
		TextColor3: theme.colors.content,
		Size: new UDim2(0, 40, 1, 0),
		AutomaticSize: Enum.AutomaticSize.X,
		BackgroundTransparency: 1,
		LayoutOrder: 2,
	})

	const runtimeLabel =
		descriptor.kind === 'system'
			? entityFor('TextLabel', {
					Name: 'runtime',
					Text:
						descriptor.runtimeMs !== undefined
							? formatMs(descriptor.runtimeMs)
							: '?',
					FontFace: theme.fonts.extraLightItalic,
					TextSize: theme.fontSizes.tiny,
					TextXAlignment: Enum.TextXAlignment.Left,
					TextYAlignment: Enum.TextYAlignment.Bottom,
					TextColor3: theme.colors.contentMuted,
					Size: new UDim2(0, 35, 1, 0),
					BackgroundTransparency: 1,
					LayoutOrder: 3,
				})
			: undefined

	const chevron = entityFor('ImageLabel', {
		Name: 'chevron',
		Size: UDim2.fromScale(0, 1),
		Position: UDim2.fromScale(0.8, 0),
		BackgroundTransparency: 1,
		Image: theme.icons.chevronRight,

		child: entityFor('UIAspectRatioConstraint', {
			AspectType: Enum.AspectType.ScaleWithParentSize,
			DominantAxis: Enum.DominantAxis.Height,
		}),
	})

	const header = entityFor('ImageButton', {
		Name: 'header',
		Size: new UDim2(1, 0, 0, HEADER_HEIGHT),
		BackgroundColor3: theme.colors.surface2,
		LayoutOrder: 0,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Horizontal,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			entityFor('UIPadding', {
				PaddingBottom: theme.paddingSizes.small,
				PaddingTop: theme.paddingSizes.small,
				PaddingLeft: theme.paddingSizes.small,
				PaddingRight: theme.paddingSizes.small,
			}),

			entityFor('UICorner', {
				CornerRadius: theme.paddingSizes.medium,
			}),

			entityFor('UIStroke', {
				Color: theme.colors.border,
			}),

			entityFor('Frame', {
				Name: 'left',
				Size: UDim2.fromScale(0, 1),
				BackgroundTransparency: 1,

				children: [
					entityFor('UIListLayout', {
						FillDirection: Enum.FillDirection.Horizontal,
						SortOrder: Enum.SortOrder.LayoutOrder,
						Padding: theme.paddingSizes.medium,
					}),

					entityFor('UIFlexItem', {
						FlexMode: Enum.UIFlexMode.Fill,
					}),

					icon,
					id,
					label,
					runtimeLabel,
				],
			}),

			chevron,
		],
	})

	return {
		root: header,
		icon,
		id,
		label,
		runtimeLabel,
		chevron,
	}
}

function makeDetailContainer(theme: Theme): EntityInstance<Frame> {
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

function makeBody(theme: Theme): EntityViewBody {
	const details = makeDetailContainer(theme)

	const root = entityFor('Frame', {
		Name: 'body',
		Size: UDim2.fromScale(1, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		Transparency: 1,
		LayoutOrder: 1,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Vertical,
				HorizontalFlex: Enum.UIFlexAlignment.Fill,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			entityFor('UIPadding', {
				PaddingLeft: new UDim(0, theme.explorerIndent),
			}),

			details,
		],
	})

	return {
		root,
		details,
		detailsSignature: '',
	}
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
