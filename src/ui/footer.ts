import { EnvToggle, getActiveEnv, setActiveEnv } from '../state/explorer'
import type { Theme } from '../themes'
import { type EntityInstance, entityFor } from '../util/instance'

function envToggleButton(theme: Theme): EntityInstance<Frame> {
	const dot = entityFor('Frame', {
		Name: 'dot',
		Size: UDim2.fromOffset(8, 8),
		BackgroundColor3: theme.colors.client,
		BorderSizePixel: 0,
		LayoutOrder: 0,

		child: entityFor('UICorner', {
			CornerRadius: new UDim(1, 0),
		}),
	})

	const label = entityFor('TextButton', {
		Name: 'label',
		Text: 'Client',
		FontFace: theme.fonts.regular,
		TextSize: theme.fontSizes.small,
		TextColor3: theme.colors.content,
		BackgroundTransparency: 1,
		Size: new UDim2(0, 35, 1, 0),
		LayoutOrder: 1,

		callback: (_e, inst) => {
			inst.MouseButton1Click.Connect(() => {
				setActiveEnv(getActiveEnv() === 'client' ? 'server' : 'client', theme)
			})
		},
	})

	const toggle = entityFor('Frame', {
		Name: 'envToggle',
		AnchorPoint: new Vector2(0.5, 0.5),
		Size: UDim2.fromScale(0, 1),
		AutomaticSize: Enum.AutomaticSize.X,
		BackgroundColor3: theme.colors.surface2,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Horizontal,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
				VerticalAlignment: Enum.VerticalAlignment.Center,
			}),

			entityFor('UICorner', {
				CornerRadius: theme.paddingSizes.medium,
			}),

			entityFor('UIStroke', {
				Color: theme.colors.border,
			}),

			entityFor('UIPadding', {
				PaddingLeft: theme.paddingSizes.small,
				PaddingRight: theme.paddingSizes.small,
			}),

			dot,
			label,
		],
	})

	toggle[0].set(EnvToggle, {
		dot: dot[1],
		label: label[1],
	})

	return toggle
}

/** Builds the footer with the client/server environment toggle. */
export default function footer(theme: Theme): EntityInstance<Frame> {
	return entityFor('Frame', {
		Name: 'footer',
		Size: new UDim2(1, 0, 0, 25),
		BackgroundColor3: theme.colors.surface1,
		BorderColor3: theme.colors.border,
		LayoutOrder: 2,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Horizontal,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			entityFor('UIPadding', {
				PaddingBottom: theme.paddingSizes.small,
				PaddingTop: theme.paddingSizes.small,
				PaddingLeft: theme.paddingSizes.small,
				PaddingRight: theme.paddingSizes.small,
			}),

			envToggleButton(theme),
		],
	})
}
