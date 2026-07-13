import { entityFor, type EntityInstance } from '../../instance'
import type { Theme } from '../../themes'
import dashboard from './dashboard'
import entityList from './entityList'

export default function explorer(theme: Theme): EntityInstance<Frame> {
    return entityFor('Frame', {
        Name: 'explorer',
        Size: new UDim2(1, 0, 1, -35),
		Transparency: 1,
        LayoutOrder: 1,

        children: [
            entityFor('UIFlexItem', {
                FlexMode: Enum.UIFlexMode.Fill,
            }),

            entityFor('UIListLayout', {
                HorizontalFlex: Enum.UIFlexAlignment.Fill,
                SortOrder: Enum.SortOrder.LayoutOrder,
            }),

            dashboard(theme),

            entityList(theme),
        ],
    })
}
