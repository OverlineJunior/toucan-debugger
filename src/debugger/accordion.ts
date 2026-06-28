import { Make as make } from '@rbxts/altmake'
import { Color, Fonts, FontSize, Icons, Padding } from './style'

const TITLE_BAR_HEIGHT = 35

function makeTitleBar(title: string): {
	root: ImageButton
	chevron: ImageLabel
} {
	const chevron = Icons.chevronRightBold({
		scale: 0.7,
		rotation: 90,
		// We have to manually move the icon to the right on the center because
		// rotation doesn't work when the GUI has a UIListLayout sibling.
		anchor: new Vector2(1, 0.5),
		position: UDim2.fromScale(1, 0.5),
	})

	const root = make('ImageButton', {
		Name: 'titleBar',
		Size: new UDim2(1, 0, 0, TITLE_BAR_HEIGHT),
		BackgroundColor3: Color.surface1,
		BorderColor3: Color.border,

		Children: [
			make('UIPadding', {
				PaddingLeft: Padding.medium,
				PaddingRight: Padding.medium,
				PaddingBottom: Padding.small,
				PaddingTop: Padding.small,
			}),

			make('TextLabel', {
				Name: 'title',
				Text: title,
				FontFace: Fonts.bold,
				TextSize: FontSize.large,
				TextColor3: Color.content,
				TextXAlignment: Enum.TextXAlignment.Left,
				TextYAlignment: Enum.TextYAlignment.Center,
				Size: UDim2.fromScale(0.5, 1),
				BackgroundTransparency: 1,
			}),

			chevron,
		],
	})

	return { root, chevron }
}

function makeContents(): ScrollingFrame {
	return make('ScrollingFrame', {
		Name: 'contents',
		Size: new UDim2(1, 0, 1, -TITLE_BAR_HEIGHT),
		CanvasSize: UDim2.fromOffset(0, 0),
		AutomaticCanvasSize: Enum.AutomaticSize.Y,
		ScrollBarThickness: 0,
		BackgroundColor3: Color.surface2,
		BorderColor3: Color.border,

		Children: [
			make('UIListLayout', {
				SortOrder: Enum.SortOrder.LayoutOrder,
			}),
		],
	})
}

export default function accordion(
	title: string,
	props?: { order?: number },
): { root: Frame; contents: ScrollingFrame } {
	const contents = makeContents()
	const titleBar = makeTitleBar(title)
	const flex = make('UIFlexItem', {
		FlexMode: Enum.UIFlexMode.Fill,
	})
	const root = make('Frame', {
		Name: 'accordion',
		Size: UDim2.fromScale(0, 0),
		Transparency: 1,
		LayoutOrder: props?.order ?? 0,

		Children: [
			make('UISizeConstraint', {
				MinSize: new Vector2(0, TITLE_BAR_HEIGHT),
			}),

			make('UIListLayout', {
				SortOrder: Enum.SortOrder.LayoutOrder,
			}),

			flex,
			titleBar.root,
			contents,
		],
	})

	titleBar.root.MouseButton1Click.Connect(() => {
		const shouldClose = flex.FlexMode !== Enum.UIFlexMode.None
		flex.FlexMode = shouldClose ? Enum.UIFlexMode.None : Enum.UIFlexMode.Fill
		titleBar.chevron.Rotation = shouldClose ? 0 : 90
	})

	return { root, contents }
}
