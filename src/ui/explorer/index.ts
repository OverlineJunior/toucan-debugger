import type { Theme } from '../../themes'
import { type EntityInstance, entityFor } from '../../util/instance'
import dashboard from './dashboard'
import { clientEntityList, serverEntityList } from './entityList'

/** Builds the explorer panel containing the client and server lists. */
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

			clientEntityList(theme),

			serverEntityList(theme),
		],
	})
}
