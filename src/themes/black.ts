import type { Theme } from '.'

const FONT_INTER = 'rbxassetid://12187365364'

const blackTheme: Theme = {
	colors: {
		content: Color3.fromRGB(255, 255, 255),
		contentMuted: Color3.fromRGB(130, 130, 130),
		contentInverse: Color3.fromRGB(0, 0, 0),
		surface1: Color3.fromRGB(0, 0, 0),
		surface2: Color3.fromRGB(16, 16, 16),
		surface3: Color3.fromRGB(24, 24, 24),
		border: Color3.fromRGB(64, 64, 64),
		borderMuted: Color3.fromRGB(32, 32, 32),
		client: Color3.fromRGB(40, 140, 255),
		server: Color3.fromRGB(40, 255, 55),
		err: Color3.fromRGB(255, 40, 40),
	},
	icons: {
		chevronRight: 'rbxassetid://91961514867203',
		chevronRightBold: 'rbxassetid://78446529333772',
		chevronDown: 'rbxassetid://123200207756033',
		chevronDownBold: 'rbxassetid://71570100619926',
		entity: 'rbxassetid://121754780381983',
		component: 'rbxassetid://103486198456556',
		system: 'rbxassetid://126773419182062',
		schedule: 'rbxassetid://101145334879600',
		plugin: 'rbxassetid://128862954392950',
	},
	fonts: {
		black: new Font(FONT_INTER, Enum.FontWeight.Heavy),
		bold: new Font(FONT_INTER, Enum.FontWeight.Bold),
		regular: new Font(FONT_INTER, Enum.FontWeight.Regular),
		extraLightItalic: new Font(
			FONT_INTER,
			Enum.FontWeight.ExtraLight,
			Enum.FontStyle.Italic,
		),
	},
	fontSizes: {
		tiny: 10,
		small: 12,
		large: 16,
		huge: 36,
	},
	paddingSizes: {
		small: new UDim(undefined, 3),
		medium: new UDim(undefined, 6),
		large: new UDim(undefined, 9),
	},
	explorerIndent: 20,
}

export default blackTheme
