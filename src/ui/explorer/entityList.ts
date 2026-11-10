import { type Component, component } from '@rbxts/toucan'
import type { Theme } from '../../themes'
import { type EntityInstance, entityFor } from '../../util/instance'

export const ClientEntityList = component('ClientEntityList')
export const ServerEntityList = component('ServerEntityList')

function makeEntityList(
	name: string,
	tag: Component<undefined>,
	theme: Theme,
	beginVisible: boolean,
): EntityInstance<ScrollingFrame> {
	return entityFor('ScrollingFrame', {
		Name: name,
		Visible: beginVisible,
		CanvasSize: UDim2.fromScale(0, 0),
		AutomaticCanvasSize: Enum.AutomaticSize.Y,
		ScrollBarThickness: 0,
		BackgroundColor3: theme.colors.surface1,
		BorderColor3: theme.colors.border,
		LayoutOrder: 1,
		callback: (e) => e.set(tag),

		children: [
			entityFor('UIFlexItem', {
				FlexMode: Enum.UIFlexMode.Fill,
			}),

			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Vertical,
				HorizontalFlex: Enum.UIFlexAlignment.Fill,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			entityFor('UIPadding', {
				PaddingLeft: theme.paddingSizes.medium,
				PaddingRight: theme.paddingSizes.medium,
				PaddingTop: theme.paddingSizes.large,
				PaddingBottom: theme.paddingSizes.large,
			}),
		],
	})
}

/** Builds the client-side entity list. */
export function clientEntityList(theme: Theme): EntityInstance<ScrollingFrame> {
	return makeEntityList('clientEntityList', ClientEntityList, theme, true)
}

/** Builds the hidden server-side entity list. */
export function serverEntityList(theme: Theme): EntityInstance<ScrollingFrame> {
	return makeEntityList('serverEntityList', ServerEntityList, theme, false)
}
