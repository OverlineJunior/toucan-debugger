import { type EntityInstance, entityFor } from '../instance'
import { ROBLOX_TOPBAR_HEIGHT, type Theme } from '../themes'

export default function hero(theme: Theme): EntityInstance<Frame> {
	return entityFor('Frame', {
		Name: 'hero',
		Size: new UDim2(1, 0, 0, ROBLOX_TOPBAR_HEIGHT),
		BackgroundTransparency: 1,
		LayoutOrder: 0,

		children: [
			entityFor('UIPadding', {
				PaddingRight: theme.paddingSizes.medium,
			}),

			entityFor('TextLabel', {
				Name: 'title',
				Text: 'Toucan',
				FontFace: theme.fonts.black,
				Size: new UDim2(1, 0, 1, 0),
				TextXAlignment: Enum.TextXAlignment.Right,
				TextYAlignment: Enum.TextYAlignment.Bottom,
				TextColor3: theme.colors.contentInverse,
				TextSize: theme.fontSizes.huge,
				BackgroundTransparency: 1,
			}),
		],
	})
}
