import { Make as make } from '@rbxts/altmake'
import { Builtin, type Handle } from '@rbxts/toucan'
import collapsible, { type Collapsible } from './collapsible'
import { Color, FontSize, Fonts, Icons, Padding } from './style'

const HEADER_HEIGHT = 25

function makeHeader(entity: Handle): Instance[] {
	const entityIcon = entity.has(Builtin.Component) ? Icons.puzzle : Icons.box

	return [
		make('UIPadding', {
			PaddingBottom: Padding.small,
			PaddingLeft: Padding.small,
			PaddingRight: Padding.small,
			PaddingTop: Padding.small,
		}),

		make('UIListLayout', {
			FillDirection: Enum.FillDirection.Horizontal,
			VerticalAlignment: Enum.VerticalAlignment.Center,
			SortOrder: Enum.SortOrder.LayoutOrder,
			Padding: Padding.medium,
		}),

		entityIcon({ color: Color.contentMuted }),

		make('TextLabel', {
			Name: 'id',
			Text: `#${entity.id}`,
			FontFace: Fonts.regular,
			TextSize: FontSize.small,
			TextColor3: Color.contentMuted,
			TextXAlignment: Enum.TextXAlignment.Left,
			BackgroundTransparency: 1,
			Size: new UDim2(0, 32, 1, 0),
			LayoutOrder: 1,
		}),

		make('TextLabel', {
			Name: 'label',
			Text: entity.toString(),
			FontFace: Fonts.bold,
			TextSize: FontSize.small,
			TextColor3: Color.content,
			TextXAlignment: Enum.TextXAlignment.Left,
			BackgroundTransparency: 1,
			AutomaticSize: Enum.AutomaticSize.X,
			Size: new UDim2(0, 0, 1, 0),
			LayoutOrder: 2,
		}),
	]
}

export default function entityEntry(
	entity: Handle,
	body: Instance[],
): Collapsible {
	return collapsible(makeHeader(entity), body, {
		headerSize: new UDim2(1, 0, 0, HEADER_HEIGHT),
		headerBackgroundColor: Color.surface2,
		bodyBackgroundColor: Color.surface1,
	})
}
