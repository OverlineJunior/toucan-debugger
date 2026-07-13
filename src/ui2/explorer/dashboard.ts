import { type EntityInstance, entityFor } from '../../instance'
import type { Theme } from '../../themes'

export default function dashboard(theme: Theme): EntityInstance<Frame> {
    return entityFor('Frame', {
        Name: 'dashboard',
        AutomaticSize: Enum.AutomaticSize.Y,
        BackgroundColor3: theme.colors.surface1,
        LayoutOrder: 0,
	})
}
