import { Make as make } from '@rbxts/altmake'
import { Color, FontSize, Fonts, Padding, ROBLOX_TOPBAR_HEIGHT } from './style'

export default function hero(): Frame {
	return make('Frame', {
		Name: 'titleBar',
		Size: new UDim2(1, 0, 0, ROBLOX_TOPBAR_HEIGHT),
		BackgroundTransparency: 1,
		LayoutOrder: 0,

		Children: [
			make('UIPadding', {
				PaddingRight: Padding.small,
			}),

			make('TextLabel', {
				Name: 'title',
				Text: 'Toucan',
				FontFace: Fonts.black,
				Size: new UDim2(1, 0, 1, 0),
				TextXAlignment: Enum.TextXAlignment.Right,
				TextYAlignment: Enum.TextYAlignment.Bottom,
				TextColor3: Color.contentInverse,
				TextSize: FontSize.huge,
				BackgroundTransparency: 1,
			}),
		],
	})
}
