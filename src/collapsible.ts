import { component, query } from '@rbxts/toucan'
import type { Theme } from './themes'

export const Collapsible = component<{
	toggleButton: GuiButton
	chevron: ImageLabel
	body: GuiObject
}>('Collapsible')

// TODO: This is temporary - use `useEvent` or another approach.
const Done = component('Done')

export function updateCollapsible(theme: Theme) {
    query(Collapsible).forEach((e, { toggleButton, chevron, body }) => {
        const hasContent = body.GetChildren().some((c) => c.IsA('GuiObject'))
        chevron.Visible = hasContent

        if (!e.has(Done)) {
            // Start closed.
            body.Visible = false

            toggleButton.MouseButton1Click.Connect(() => {
                if (!hasContent) return

                body.Visible = !body.Visible
                chevron.Image = body.Visible
                    ? theme.icons.chevronDown
                    : theme.icons.chevronRight
            })

            e.set(Done)
        }
    })
}
