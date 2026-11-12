import { component, query } from '@rbxts/toucan'
import type { Theme } from '../themes'

export const Collapsible = component<{
	toggleButton: GuiButton
	chevron: ImageLabel
	body: GuiObject
}>('Collapsible')

// TODO: This is temporary - use `useEvent` or another approach.
const CollapsibleInitialized = component('Done')

export function updateCollapsible(theme: Theme) {
	query(Collapsible).forEach((e, { toggleButton, chevron, body }) => {
		// Only visible GuiObjects count, so the always-present empty details frame is ignored.
		const hasContent = () =>
			body.GetChildren().some((c) => c.IsA('GuiObject') && c.Visible)

		const content = hasContent()
		chevron.Visible = content

		if (!content) {
			body.Visible = false
			chevron.Image = theme.icons.chevronRight
		}

		if (!e.has(CollapsibleInitialized)) {
			// Start closed.
			body.Visible = false

			toggleButton.MouseButton1Click.Connect(() => {
				if (!hasContent()) return

				body.Visible = !body.Visible
				chevron.Image = body.Visible
					? theme.icons.chevronDown
					: theme.icons.chevronRight
			})

			e.set(CollapsibleInitialized)
		}
	})
}
