import { Make as make } from '@rbxts/altmake'
import { Color } from './style'

export default function footer(): Frame {
	return make('Frame', {
		Name: 'footer',
		Size: new UDim2(1, 0, 0, 25),
		BackgroundColor3: Color.surface1,
		BorderColor3: Color.border,
		LayoutOrder: 2,
	})
}
