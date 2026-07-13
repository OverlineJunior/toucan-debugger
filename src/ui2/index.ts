import { entityFor } from '../instance'
import type { Theme } from '../themes'
import explorer from './explorer'
import footer from './footer'
import hero from './hero'

export default function explorerPanel(parent: Instance, theme: Theme) {
	entityFor('ScreenGui', {
		Name: 'toucanExplorer',
		Parent: parent,
		IgnoreGuiInset: true,

		children: [
			entityFor('Frame', {
				Name: 'panel',
				Position: UDim2.fromScale(0, 0),
				Size: new UDim2(0, 300, 1, 0),
				BackgroundColor3: theme.colors.surface2,
				BorderColor3: theme.colors.border,
				BackgroundTransparency: 0.15,

				children: [
					entityFor('UIListLayout', {
						FillDirection: Enum.FillDirection.Vertical,
						HorizontalFlex: Enum.UIFlexAlignment.Fill,
						SortOrder: Enum.SortOrder.LayoutOrder,
					}),

                    hero(theme),

                    explorer(theme),

                    footer(theme),
				],
			}),
		],
	})
}
