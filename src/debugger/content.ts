import { Make as make } from '@rbxts/altmake'

export default function content(children: GuiObject[]): Frame {
	return make('Frame', {
		Name: 'content',
		Size: new UDim2(1, 0, 1, -35),
		Transparency: 1,
		LayoutOrder: 1,

		Children: [
			make('UIFlexItem', {
				FlexMode: Enum.UIFlexMode.Fill,
			}),

			make('UIListLayout', {
				HorizontalFlex: Enum.UIFlexAlignment.Fill,
				SortOrder: Enum.SortOrder.LayoutOrder,
			}),

			...children,
		],
	})
}
