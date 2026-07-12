import { Make as make } from '@rbxts/altmake'
import { Color, IconIds, icon } from './style'

export interface Collapsible {
	root: ImageButton
	body: Frame
	setDisabled: (disabled: boolean) => void
	setDepth: (depth: number) => void
}

const FILL_ORDER = 999
const CHEVRON_ORDER = 1000

/**
 * Generic collapsible with `root` and `body` slots and a chevron.
 *
 * Can be disabled with `setDisabled`, acting like a simple frame with just `root`.
 */
export default function collapsible(
	headerChildren: Instance[],
	bodyChildren: Instance[],
	props?: {
		headerSize?: UDim2
		headerBackgroundColor?: Color3
		headerTransparency?: number
		headerBorderColor?: Color3
		bodyBackgroundColor?: Color3
		bodyTransparency?: number
		bodyBorderColor?: Color3
	},
): Collapsible {
	let open = false
	let disabled = false

	const chevron = icon(IconIds.chevronRight, {
		anchor: new Vector2(0, 0.5),
		position: UDim2.fromScale(0, 0.5),
		order: CHEVRON_ORDER,
	})

	const fill = make('Frame', {
		Name: 'fill',
		Size: UDim2.fromScale(0, 1),
		BackgroundTransparency: 1,
		LayoutOrder: FILL_ORDER,

		Children: make('UIFlexItem', {
			FlexMode: Enum.UIFlexMode.Grow,
		}),
	})

	const body = make('Frame', {
		Name: 'body',
		Size: UDim2.fromScale(1, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		BackgroundTransparency: props?.bodyTransparency ?? 0,
		BackgroundColor3: props?.bodyBackgroundColor ?? Color.surface1,
		BorderColor3: props?.bodyBorderColor ?? Color.border,
		Visible: false,

		Children: [
			make('UIListLayout', {
				SortOrder: Enum.SortOrder.LayoutOrder,
			}),

			...bodyChildren,
		],
	})

	function setOpen(value: boolean) {
		open = value
		body.Visible = open
		chevron.Image = open ? IconIds.chevronDown : IconIds.chevronRight
	}

	function setDisabled(value: boolean) {
		disabled = value
		chevron.Visible = !disabled

		if (disabled && open) {
			setOpen(false)
		}
	}

	const header = make('Frame', {
		Name: 'header',
		Size: props?.headerSize ?? UDim2.fromScale(1, 1),
		BackgroundTransparency: props?.headerTransparency ?? 0,
		BackgroundColor3: props?.headerBackgroundColor ?? Color.surface1,
		BorderColor3: props?.headerBorderColor ?? Color.border,

		Children: [fill, chevron, ...headerChildren],
	})

	const root = make('ImageButton', {
		Name: 'collapsible',
		Size: UDim2.fromScale(1, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		BackgroundTransparency: 1,

		Children: [
			make('UIListLayout', {
				SortOrder: Enum.SortOrder.LayoutOrder,
			}),

			header,

			body,
		],
	})

	root.MouseButton1Click.Connect(() => {
		if (disabled) return
		setOpen(!open)
	})

	function setDepth(depth: number) {
		const uiPadding = header.FindFirstChildOfClass('UIPadding')
		if (uiPadding) {
			uiPadding.PaddingLeft = new UDim(0, 5 + depth * 16)
		}
	}

	return { root, body, setDisabled, setDepth }
}
