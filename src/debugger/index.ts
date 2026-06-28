import { Make as make } from '@rbxts/altmake'
import { Color } from './style'
import accordion from './accordion'
import hero from './hero'
import content from './content'
import footer from './footer'

export interface DebuggerPanel {
	screen: ScreenGui
}

export default function debuggerPanel(parent: Instance): DebuggerPanel {
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

					content([accordion('Entities').root, accordion('Scheduler').root]),

					footer(),
				],
			}),
		],
	})

	return { screen }
}
