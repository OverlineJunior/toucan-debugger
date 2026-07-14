import { entityFor, type EntityInstance } from "../instance";
import type { Theme } from "../themes";

export default function footer(theme: Theme): EntityInstance<Frame> {
    return entityFor('Frame', {
        Name: 'footer',
        Size: new UDim2(1, 0, 0, 25),
        BackgroundColor3: theme.colors.surface1,
        BorderColor3: theme.colors.border,
        LayoutOrder: 2,
    })
}
