import type { Theme } from '../../themes'
import { type EntityInstance, entityFor } from '../../util/instance'

export default function dashboard(theme: Theme): EntityInstance<Frame> {
	return entityFor('Frame', {
		Name: 'dashboard',
		AutomaticSize: Enum.AutomaticSize.Y,
		BackgroundColor3: theme.colors.surface1,
		LayoutOrder: 0,
	})
}
