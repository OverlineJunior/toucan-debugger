import { component, query } from '@rbxts/toucan'
import type { Theme } from '../themes'

export const Collapsible = component<{
	toggleButton: GuiButton
	chevron: ImageLabel
	body: GuiObject
	hasChildren?: () => boolean
}>('Collapsible')

// TODO: This is temporary - use `useEvent` or another approach.
const CollapsibleInitialized = component('Done')

function hasContent(body: GuiObject): boolean {
	// Only visible GuiObjects count, so the always-present empty details frame is ignored.
	return body.GetChildren().some((c) => c.IsA('GuiObject') && c.Visible)
}

export function updateCollapsible(theme: Theme) {
	query(Collapsible)
		.without(CollapsibleInitialized)
		.forEach((e, { toggleButton, chevron, body, hasChildren }) => {
			const sync = () => {
				if (body.Visible && !hasContent(body)) {
					body.Visible = false
				}

				chevron.Image = body.Visible
					? theme.icons.chevronDown
					: theme.icons.chevronRight
				chevron.Visible = body.Visible || (hasChildren?.() ?? false)
			}

			// Start closed.
			body.Visible = false
			sync()

			toggleButton.MouseButton1Click.Connect(() => {
				if (!hasContent(body)) return

				body.Visible = !body.Visible
				sync()
			})

			body.ChildAdded.Connect(sync)
			body.ChildRemoved.Connect(sync)

			for (const child of body.GetChildren()) {
				if (child.IsA('GuiObject')) {
					child.GetPropertyChangedSignal('Visible').Connect(sync)
				}
			}

			e.set(CollapsibleInitialized)
		})
}
