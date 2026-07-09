import { Make as make } from '@rbxts/altmake'
import { Color } from './style'
import accordion from './accordion'
import hero from './hero'
import footer from './footer'
import { component, InferValue } from '@rbxts/toucan'

export const DebuggerPanel = component<{
	screen: ScreenGui
	entityContents: ScrollingFrame
}>('DebuggerPanel')

function makeContent(children: GuiObject[]): Frame {
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

export default function debuggerPanel(parent: Instance): InferValue<typeof DebuggerPanel> {
	const entities = accordion('Entities')

	const screen = make('ScreenGui', {
		Name: 'toucanDebugger',
		Parent: parent,
		IgnoreGuiInset: true,

		Children: [
			make('Frame', {
				Name: 'panel',
				Position: UDim2.fromScale(0, 0),
				Size: new UDim2(0, 300, 1, 0),
				BackgroundColor3: Color.surface2,
				BorderColor3: Color.border,
				BackgroundTransparency: 0.15,

				Children: [
					make('UIListLayout', {
						FillDirection: Enum.FillDirection.Vertical,
						HorizontalFlex: Enum.UIFlexAlignment.Fill,
						SortOrder: Enum.SortOrder.LayoutOrder,
					}),

					hero(),

					makeContent([entities.root, accordion('Scheduler').root]),

					footer(),
				],
			}),
		],
	})

	return { screen, entityContents: entities.contents }
}
