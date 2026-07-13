import { component, type EntityHandle, pair, type Handle, Builtin } from '@rbxts/toucan'
import { type EntityInstance, entityFor } from '../../instance'
import type { Theme } from '../../themes'

const HEADER_HEIGHT = 20

export const EntryFor = component('EntryFor')

export default function entityEntry(
    entity: Handle,
    parentEntt: Handle,
    parentInst: Instance,
    theme: Theme,
): EntityInstance<TextLabel> {
    return entityFor('TextLabel', {
        Name: `entityEntry(${entity})`,
        Text: entity.toString(),
        TextColor3: theme.colors.content,
        TextScaled: true,
        Size: UDim2.fromOffset(0, HEADER_HEIGHT),
        BackgroundColor3: theme.colors.surface2,
        BorderColor3: theme.colors.border,

        callback: (e, inst) => {
            e
                .set(pair(Builtin.ChildOf, parentEntt as EntityHandle))
                .set(pair(EntryFor, entity as EntityHandle))
            inst.Parent = parentInst
        }
    })
}
