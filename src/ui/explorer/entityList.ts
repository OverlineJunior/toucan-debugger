import { component } from '@rbxts/toucan'
import { type EntityInstance, entityFor } from '../../instance'
import type { Theme } from '../../themes'

export const EntityList = component('EntityList')

export default function entityList(theme: Theme): EntityInstance<ScrollingFrame> {
	return entityFor('ScrollingFrame', {
        Name: 'entityList',
        CanvasSize: UDim2.fromScale(0, 0),
        AutomaticCanvasSize: Enum.AutomaticSize.Y,
        ScrollBarThickness: 0,
        BackgroundColor3: theme.colors.surface1,
        BorderColor3: theme.colors.border,
        LayoutOrder: 1,
        callback: (e) => e.set(EntityList),

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
