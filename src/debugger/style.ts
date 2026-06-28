import { Make as make } from 'altmake'

export const ROBLOX_TOPBAR_HEIGHT = 58

const FONT_INTER = 'rbxassetid://12187365364'

export namespace Color {
	export const content = Color3.fromRGB(255, 255, 255)
	export const contentMuted = Color3.fromRGB(130, 130, 130)
	export const contentInverse = Color3.fromRGB(0, 0, 0)
	export const surface1 = Color3.fromRGB(0, 0, 0)
	export const surface2 = Color3.fromRGB(16, 16, 16)
	export const border = Color3.fromRGB(64, 64, 64)
	export const client = Color3.fromRGB(40, 140, 255)
	export const server = Color3.fromRGB(40, 255, 55)
	export const err = Color3.fromRGB(255, 40, 40)
}

export namespace FontSize {
	export const huge = 36
	export const large = 16
	export const small = 12
}

export namespace Padding {
	export const medium = new UDim(undefined, 10)
	export const small = new UDim(undefined, 5)
}

export namespace Fonts {
	export const black = new Font(FONT_INTER, Enum.FontWeight.Heavy)
	export const bold = new Font(FONT_INTER, Enum.FontWeight.Bold)
	export const regular = new Font(FONT_INTER, Enum.FontWeight.Regular)
	export const extraLightItalic = new Font(
		FONT_INTER,
		Enum.FontWeight.ExtraLight,
		Enum.FontStyle.Italic,
	)
}

export interface IconProps {
	scale?: number
	offset?: number
	color?: Color3
	position?: UDim2
	rotation?: number
	anchor?: Vector2
}

function makeIcon(id: number, props?: IconProps): ImageLabel {
	const size = props?.scale
		? UDim2.fromScale(props.scale, props.scale)
		: props?.offset
			? UDim2.fromOffset(props.offset, props.offset)
			: UDim2.fromScale(1, 1)

	return make('ImageLabel', {
		Name: 'icon',
		Image: `rbxassetid://${id}`,
		ImageColor3: props?.color ?? Color.content,
		Size: size,
		BackgroundTransparency: 1,
		Position: props?.position ?? UDim2.fromScale(0, 0),
		Rotation: props?.rotation ?? 0,
		AnchorPoint: props?.anchor ?? Vector2.zero,

		Children: make('UIAspectRatioConstraint'),
	})
}

export namespace Icons {
	export const chevronRight = (props?: IconProps) =>
		makeIcon(84839472552140, props)
	export const chevronRightBold = (props?: IconProps) =>
		makeIcon(78446529333772, props)
	export const puzzle = (props?: IconProps) => makeIcon(132097048540989, props)
	export const box = (props?: IconProps) => makeIcon(117106064006931, props)
}
