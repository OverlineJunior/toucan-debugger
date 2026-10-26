import blackTheme from './black'
import whiteTheme from './white'

export const ROBLOX_TOPBAR_HEIGHT = 58

export interface Theme {
	colors: {
		content: Color3
		contentMuted: Color3
		contentInverse: Color3
		surface1: Color3
		surface2: Color3
		surface3: Color3
		border: Color3
		borderMuted: Color3
		client: Color3
		server: Color3
		err: Color3
	}
	icons: {
		chevronRight: string
		chevronRightBold: string
		chevronDown: string
		chevronDownBold: string
		entity: string
		component: string
		system: string
		schedule: string
		plugin: string
	}
	fonts: {
		black: Font
		bold: Font
		regular: Font
		extraLightItalic: Font
	}
	fontSizes: {
		tiny: number
		small: number
		large: number
		huge: number
	}
	paddingSizes: {
		small: UDim
		medium: UDim
		large: UDim
	}
	explorerIndent: number
}

export const themes = {
	black: blackTheme,
	white: whiteTheme,
}
