import { Make as make } from 'altmake'

export const ROBLOX_TOPBAR_HEIGHT = 58

const FONT_INTER = 'rbxassetid://12187365364'

export namespace Color {
	export const content = Color3.fromRGB(255, 255, 255)
	export const contentMuted = Color3.fromRGB(130, 130, 130)
	export const contentInverse = Color3.fromRGB(0, 0, 0)
	export const surface1 = Color3.fromRGB(0, 0, 0)
	export const surface2 = Color3.fromRGB(16, 16, 16)
	export const surface3 = Color3.fromRGB(24, 24, 24)
	export const border = Color3.fromRGB(64, 64, 64)
	export const borderMuted = Color3.fromRGB(32, 32, 32)
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
	order?: number
}

export function icon(id: string, props?: IconProps): ImageLabel {
	const size = props?.scale
		? UDim2.fromScale(props.scale, props.scale)
		: props?.offset
			? UDim2.fromOffset(props.offset, props.offset)
			: UDim2.fromScale(1, 1)

	return make('ImageLabel', {
		Name: 'icon',
		Image: id,
		ImageColor3: props?.color ?? Color.content,
		Size: size,
		BackgroundTransparency: 1,
		Position: props?.position ?? UDim2.fromScale(0, 0),
		Rotation: props?.rotation ?? 0,
		AnchorPoint: props?.anchor ?? Vector2.zero,
		LayoutOrder: props?.order ?? 0,

		Children: make('UIAspectRatioConstraint'),
	})
}

export namespace IconIds {
	export const chevronRight = 'rbxassetid://84839472552140'
	export const chevronRightBold = 'rbxassetid://78446529333772'
	export const chevronDown = 'rbxassetid://123273356220210'
	export const chevronDownBold = 'rbxassetid://71570100619926'
	export const puzzle = 'rbxassetid://132097048540989'
	export const box = 'rbxassetid://117106064006931'
	export const cpu = 'rbxassetid://104146467001055'
	export const clock = 'rbxassetid://73049254764861'
	export const plug = 'rbxassetid://85799610981034'
}
