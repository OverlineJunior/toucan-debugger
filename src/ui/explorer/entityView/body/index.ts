import type { Theme } from '../../../../themes'
import { type EntityInstance, entityFor } from '../../../../util/instance'
import { makeDetailContainer } from './details'

export interface EntityViewBody {
	root: EntityInstance<Frame>
	details: EntityInstance<Frame>
	// Used for cheaper equality check between two entity views' details.
	detailsSignature: string
}

export function makeBody(theme: Theme): EntityViewBody {
	const details = makeDetailContainer(theme)

	const root = entityFor('Frame', {
		Name: 'body',
		Size: UDim2.fromScale(1, 0),
		AutomaticSize: Enum.AutomaticSize.Y,
		Transparency: 1,
		LayoutOrder: 1,

		children: [
			entityFor('UIListLayout', {
				FillDirection: Enum.FillDirection.Vertical,
				HorizontalFlex: Enum.UIFlexAlignment.Fill,
				SortOrder: Enum.SortOrder.LayoutOrder,
				Padding: theme.paddingSizes.medium,
			}),

			entityFor('UIPadding', {
				PaddingLeft: new UDim(0, theme.explorerIndent),
			}),

			details,
		],
	})

	return {
		root,
		details,
		detailsSignature: '',
	}
}
