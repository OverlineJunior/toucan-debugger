import type { Theme } from '.'

const FONT_INTER = 'rbxassetid://12187365364'

const whiteTheme: Theme = {
	colors: {
		content: Color3.fromRGB(0, 0, 0),
		contentMuted: Color3.fromRGB(125, 125, 125),
		contentInverse: Color3.fromRGB(255, 255, 255),
		surface1: Color3.fromRGB(255, 255, 255),
		surface2: Color3.fromRGB(240, 240, 240),
		surface3: Color3.fromRGB(230, 230, 230),
		border: Color3.fromRGB(190, 190, 190),
		borderMuted: Color3.fromRGB(223, 223, 223),
		client: Color3.fromRGB(0, 110, 230),
		server: Color3.fromRGB(0, 170, 30),
		err: Color3.fromRGB(220, 30, 30),
	},
	icons: {
		chevronRight: 'rbxassetid://84839472552140',
		chevronRightBold: 'rbxassetid://78446529333772',
		chevronDown: 'rbxassetid://123273356220210',
		chevronDownBold: 'rbxassetid://71570100619926',
		entity: 'rbxassetid://117106064006931',
		component: 'rbxassetid://132097048540989',
		system: 'rbxassetid://104146467001055',
		schedule: 'rbxassetid://73049254764861',
		plugin: 'rbxassetid://85799610981034',
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

export default whiteTheme
